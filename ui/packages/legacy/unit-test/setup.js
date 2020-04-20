import 'raf'
import { useFakeTimers } from 'sinon'
import localStorage from './local-storage'

require('regenerator-runtime/runtime')

global.console.warn = () => { }
global.console.error = () => { }

global.clock = useFakeTimers()
global.localStorage = localStorage()
global.navigator = { language: 'en-US' }
