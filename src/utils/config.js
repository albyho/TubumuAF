const debugAccount = 'system'
const debugPassword = '111111'

const isProduction = process.env.NODE_ENV === 'production'

export const baseURL = isProduction ? '/manager/api' : 'http://127.0.0.1:9005/manager/api'
export const defaultAccount = isProduction ? '' : debugAccount
export const defaultPassword = isProduction ? '' : debugPassword

// Development
// export const baseURL = 'http://127.0.0.1:9005/manager/api'
// export const defaultAccount = 'system'
// export const defaultPassword = '111111'

// Production
// export const baseURL = '/manager/api'
// export const defaultAccount = ''
// export const defaultPassword = ''
