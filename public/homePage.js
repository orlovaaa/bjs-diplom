//выход из ЛК

const logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(callback => {
        if (callback.success) {
            location.reload();
        }
    })
};

//инфо о пользователе 
ApiConnector.current(data => {
    if (data.success) {
        ProfileWidget.showProfile(data.data);
    }
});

//курсы валют
const ratesBoard = new RatesBoard();
function api() {
    ApiConnector.getStocks(data => {
        if (data.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(data.data);
        }
    })
}

api()
setInterval(api, 60000);

//--Операции с деньгами--
const moneyManager = new MoneyManager();

//Пополнение баланса
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data)
        }
        moneyManager.setMessage(response.success, response.success ? "Баланс пополнен!" : response.error);
    })
};


//Конвертирование валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data)
        }
        moneyManager.setMessage(response.success, response.success ? "Конвертироно успешно!" : response.error)
    })
};

//Перевод валюты
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data)
        }
        moneyManager.setMessage(response.success, response.success ? "Перевод выполнен!" : response.error)
    })
};

//--Работа с избранным--
const favoritesWidget = new FavoritesWidget()

//Начальный список избранного
ApiConnector.getFavorites((data) => {
    if (data.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data.data);
        moneyManager.updateUsersList(data.data);
    }
});

//Добавление в избранное
favoritesWidget.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable()
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        moneyManager.setMessage(response.success, response.success ? "Пользователь добавлен!" : response.error)
    })
};

//Удаление из избранного
favoritesWidget.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable()
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
        moneyManager.setMessage(response.success, response.success ? "Пользователь удален!" : response.error)
    })
};