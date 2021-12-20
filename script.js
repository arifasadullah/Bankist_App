'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Arif Asadullah',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-07-20T16:33:06.386Z',
    '2021-06-01T14:43:26.374Z',
    '2021-06-08T02:49:59.371Z',
    '2021-06-08T10:01:20.894Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Rabs Mallick',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Hafiz Mohammad Islam ',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'AED',
  locale: 'en-AE',
};

const account4 = {
  owner: 'Khalid Saifullah',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let currentAccount;

const dateFormatter = function (dates, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const dayspassed = calDaysPassed(new Date(), dates);
  if (dayspassed === 0) return `Today`;
  if (dayspassed === 1) return `Yesterday`;
  if (dayspassed <= 7) return `${dayspassed} days ago`;
  else {
    // const date = `${dates.getDate()}`.padStart(2, 0);
    // const month = `${dates.getMonth() + 1}`.padStart(2, 0);
    // const year = dates.getFullYear();
    // return `${date}-${month}-${year}`;
    return new Intl.DateTimeFormat(locale).format(dates);
  }
};

const formateCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//display transaction history
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const dates = new Date(acc.movementsDates[i]);
    const displayDate = dateFormatter(dates, acc.locale);

    const movFormatter = formateCurrency(mov, acc.locale, acc.currency);
    //  new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = ` <div class="movements__row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">${displayDate}</div>
  <div class="movements__value">${movFormatter}</div>
</div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//display available balance
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formateCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

//add username in object
const createUserName = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserName(accounts);

//update summary
const updateSummary = function (acc) {
  const displaySummaryValueIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formateCurrency(
    displaySummaryValueIn,
    acc.locale,
    acc.currency
  );

  const displaySummaryValueOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formateCurrency(
    displaySummaryValueOut,
    acc.locale,
    acc.currency
  );

  const displayInterst = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formateCurrency(
    displayInterst,
    acc.locale,
    acc.currency
  );
};

// update ui
const updateUi = function (acc) {
  displayBalance(acc);
  displayMovements(acc);
  updateSummary(acc);
};

const logoutTimer = function () {
  let time = 300;
  const tick = function () {
    const minute = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const second = `${time % 60}`.padStart(2, 0);
    labelTimer.textContent = `${minute}:${second}`;
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
//login button
let timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //International API
  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    weekday: 'long',
  };
  const locale = currentAccount.locale;
  // console.log(locale);
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display welcome
    const name = currentAccount.owner.split(' ').splice(0, 1);
    labelWelcome.textContent = ` Hey ${name}, welcome back`;
    if (timer) clearInterval(timer);
    timer = logoutTimer();
    //update ui
    updateUi(currentAccount);

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});
let transferAccount;
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    transferAccount != currentAccount.username
  ) {
    transferAccount.movements.push(amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    transferAccount.movementsDates.push(new Date().toISOString());

    //update timer
    clearInterval(timer);
    timer = logoutTimer();

    inputTransferTo.value = inputTransferAmount.value = '';
    updateUi(currentAccount);
  }
});

//request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  //10% of maximum deposit amount can approve loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      //update timer
      clearInterval(timer);
      timer = logoutTimer();

      updateUi(currentAccount);
      inputLoanAmount.value = '';
    }, 3000);
  }
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (currentAccount.username === user && currentAccount.pin === pin) {
    accounts.splice(currentAccount, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// //fake account open

// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

// setInterval(function () {
//   const now = new Date();
//   const hour = `${now.getHours()}`.padStart(2, 0);
//   const minute = `${now.getMinutes()}`.padStart(2, 0);
//   const second = `${now.getSeconds()}`.padStart(2, 0);

//   labelWelcome.textContent = `${hour}:${minute}:${second}`;
// }, 1000);
