# Express、Sequelize 實作練習

## 題目

```text
請至少使用 express 及 Sequelize 實作一個商品系統所需要的 API
功能如下：
新增商品、編輯商品、商品列表、商品內頁 及 刪除商品
使用者需要可以 註冊 及 登入
資訊如下：
商品需要的資訊有商品 名稱、價錢 及 備註
商品列表只需要 名稱 及 價錢、內頁需要 全部的資訊
編輯商品時，要留下 編輯記錄，需要知道是哪個使用者編輯及從什麼改為什麼
例如：
ttn 編輯了名稱，從 A 改成 B
Louis 編輯了價錢，從 10 改成 0
```

---

## 設計

### 編輯記錄
編輯紀錄是這個題目的核心，同時也是很多軟體系統的重要需求，因此在這個練習中，設計了 `DataLog` 表格來儲存其他資料表的資料變更紀錄，以 JSON 的編碼形式將更新前後存入欄位中。

在開發者定義一筆資料更新或刪除的行為前，呼叫 DataLog Model 的 static function 來寫入一筆編輯紀錄，同時函式內部以 try-catch 包裹，來保證寫入編輯紀錄的錯誤不會影響到 API 的正常行為。

### Authentication
身分驗證 (Authentication) 則是嘗試使用了 JWT (Json Web Token)，使用者在登入後拿到的 Token，能以 Bearer Token 的方式使用。

使用 JWT 有幾個好處：
1. 不需要在 Database 內存放 Token
2. JWT 能設定指定的過期時間
3. 使用者的多個 Token 之間不會互斥

驗證的程式碼借助了 Passport、及 JWT 的相關套件。

## 資料夾結構

```
├── app
│   └── routes
├── app.js
├── config
├── migrations
└── models
```

Sequelize-cli 會根據 config/database.js 的設定、及 migrations/ 的資料表定義檔，來執行 migration。

作為程式入口的 app.js 建立 Express 的主物件，並引入定義在 app/routes 的各個 API，Models 則定義了 ORM 在取資料時的行為及資料表關聯。

## 啟動方式

### Installation
```bash
yarn install
```

### Migration
```bash
yarn migrate
```

### Server
```bash
node app.js
```

## DB Schema

1. `users`: 使用者資料
	- id
	- username
2. `data_logs`: 編輯記錄
	- id
    - user_id: 編輯者
    - data_table_name: 修改資料的表格名稱
    - prev_data: 更新前
    - curr_data: 更新後 
3. `products`: 商品
	- id
	- name 商品名
	- price 價格
	- comment 備註

詳見 [migrations/](./migrations/)。


## API

### 註冊登入

1. `POST  /auth/signup`: 註冊使用者

	#### Request
	```json
	{
		"username": "Louis",
		"password": "12341234"
	}
	```

	#### Response
	```json
	{
		"id": "1",
		"username": "Louis",
		"createdAt": "2022-05-07T12:40:31.000Z",
		"updatedAt": "2022-05-07T12:40:31.000Z"
	}
	```

2. `POST  /auth/login`: 登入

	#### Request
	```json
	{
		"username": "Louis",
		"password": "12341234"
	}
	```

	#### Response
	```json
	{
		"id": "1",
		"username": "Louis",
		"createdAt": "2022-05-07T12:40:31.000Z",
		"updatedAt": "2022-05-07T12:40:31.000Z",
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6IkxvdWlzIiwiY3JlYXRlZEF0IjoiMjAyMi0wNS0wN1QxMjo0MDozMS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0wNS0wN1QxMjo0MDozMS4wMDBaIiwiaWF0IjoxNjUxOTMyOTk2fQ.O6g6FNF0edc2H-Rr6T7C16kmseLrACwJLCcYhz4Erjo"
	}
	```

3. `GET  /auth/me`: 測試 Token 身分狀態

	Headers 帶入 JWT (Bearer token)

	#### Response
	```json
	{
		"id": "1",
		"username": "Louis",
		"createdAt": "2022-05-07T12:40:31.000Z",
		"updatedAt": "2022-05-07T12:40:31.000Z"
	}
	```

### 商品

1. `POST  /products`: Create - 建立商品資料

	#### Request
	```json
	{
		"name": "product item name",
		"price": 500
	}
	```

	#### Response
	```json
	{
		"id": "7",
		"name": "product item name",
		"price": 500,
		"comment": null,
		"createdAt": "2022-05-07T12:42:38.000Z",
		"updatedAt": "2022-05-07T12:42:38.000Z",
		"deletedAt": null
	}
	```

2. `GET  /products`: Read - 商品列表

	列表不需要顯示`備註`欄位。

	#### Request Query Parameters
	1. `page_size` 分頁大小 (limit)
	2. `page` 取第幾頁 (offset)

	#### Response
	```json
	{
		"count": 6,
		"rows": [
			{
				"id": "4",
				"name": "4th item",
				"price": 100000
			},
			{
				"id": "5",
				"name": "5 item",
				"price": 100000
			}
		]
	}
	```

3. `GET  /products/{id}`: Read - 商品細節

	#### Response
	```json
	{
		"id": "2",
		"name": "2 item",
		"price": 100,
		"comment": null,
		"createdAt": "2022-05-07T12:42:17.000Z",
		"updatedAt": "2022-05-07T12:42:17.000Z",
		"deletedAt": null
	}
	```

4. `PUT  /products/{id}`: Update - 更新商品

	#### Request
	```json
	{
		"name": "product name after updated",
		"price": 199
	}
	```

	#### Response
	```json
	{
		"id": "1",
		"name": "product name after updated",
		"price": 199,
		"comment": null,
		"createdAt": "2022-05-07T12:42:00.000Z",
		"updatedAt": "2022-05-07T12:44:05.000Z",
		"deletedAt": null
	}
	```

5. `DELETE  /products/{id}`: Delete - 刪除商品 (軟刪除)

	#### Request
	```json
	{
		"name": "my name",
		"price": 29
	}
	```

	#### Response
	```json
	{
		"id": "3",
		"name": "3 item",
		"price": 100,
		"comment": null,
		"createdAt": "2022-05-07T12:42:23.000Z",
		"updatedAt": "2022-05-07T12:45:22.893Z",
		"deletedAt": "2022-05-07T12:45:22.893Z"
	}
	```

---

### Postman 截圖

- 註冊
<img width="865" alt="1-1  signup" src="https://user-images.githubusercontent.com/11331916/167259170-7ccaac1a-5bd3-48a3-9f94-076e9cd4f7de.png">
- 登入
<img width="870" alt="1-2  login" src="https://user-images.githubusercontent.com/11331916/167259172-06fc02e8-a139-405c-a923-d02a220fd021.png">
- Token 測試
<img width="975" alt="1-3  me" src="https://user-images.githubusercontent.com/11331916/167259173-f3d328cd-5ec0-4810-8685-e07364fcc2ee.png">

- 建立商品
<img width="869" alt="2-1  Create" src="https://user-images.githubusercontent.com/11331916/167259174-89600f47-8500-4a39-b920-5e8755a00c35.png">
- 商品列表
<img width="925" alt="2-2 List" src="https://user-images.githubusercontent.com/11331916/167259176-22e86d3f-3c43-4a9c-97fe-8497887df1d7.png">
- 商品細節
<img width="870" alt="2-3 Show" src="https://user-images.githubusercontent.com/11331916/167259177-6d8f5809-c315-4a49-b2f5-cea374a247d7.png">
- 更新商品
<img width="872" alt="2-4  Update" src="https://user-images.githubusercontent.com/11331916/167259178-d3ec9bfc-fef1-4b4d-95b2-0ea7e45781dc.png">
- 刪除商品
<img width="870" alt="2-5 Delete" src="https://user-images.githubusercontent.com/11331916/167259179-dd4a4420-5f78-4436-bd36-ad834c8ce2f3.png">

- 編輯紀錄
<img width="440" alt="3-1  DataLog Updated" src="https://user-images.githubusercontent.com/11331916/167259180-937df7fa-1114-4f1e-a666-12c72d2eff0b.png">
- 刪除紀錄
<img width="443" alt="3-2 DataLog Deleted" src="https://user-images.githubusercontent.com/11331916/167259181-845aa1f8-2694-4edc-829a-f0637655229f.png">


