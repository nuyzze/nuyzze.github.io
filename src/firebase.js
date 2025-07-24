import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDhvp8g1rT1PwUcFGo1ZtWQ0xtN68I3y4Q',
  databaseURL: 'https://cliente-teste-app-default-rtdb.firebaseio.com'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)