[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Бэкенд проекта Место

**Описание**

Бэкенд часть проекта [Место](https://github.com/PolinaAndreyanova/react-mesto-auth)

**Функциональность**
* Авторизация и регистрация пользователя
* Редактирование профиля
* Создание карточек с фотографиями
* Лайк карточек
* Удаление карточек

**Стек технологий**
* JavaScript
* Node.js
* MongoDB

**Инструкция по развертыванию**
1. Скачать проект

1.1 Установить зависимости командой:
```
npm i
```
1.2 Подключиться к БД командой:
```
mongod --dbpath=db
```
1.3 Запустить проект командой:
```
npm run start
```
2. Проверить работу сервера путем отправки запросов по адресу http://localhost:3000 
