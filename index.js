const { captureRejectionSymbol } = require('node-telegram-bot-api')
const TelegramApi = require('node-telegram-bot-api')

const { gameOptions, againOptions } = require('./options')

const token = '5601481549:AAFaMlMY-N1tXS4Sbz70clKVGnz7OC5fmz0'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Ты должен отгадать мою цифру от 0 до 9')
  const randomNumber = Math.trunc(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадывай)', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Информация' },
    { command: '/game', description: 'Начать игру' },
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.jpg'
      )
      return bot.sendMessage(chatId, `Добро пожаловать`)
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю')
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, 'Ты угадал!!!', againOptions)
    } else {
      return await bot.sendMessage(
        chatId,
        `Увы, нет, бот загадал цифру ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
