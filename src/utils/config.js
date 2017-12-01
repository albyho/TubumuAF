// Development
const isProduction = process.env.NODE_ENV === 'production'

export const baseURL = isProduction ? '/manager/api' : 'http://127.0.0.1:9005/manager/api'
export const defaultAccount = isProduction ? '' : 'system'
export const defaultPassword = isProduction ? '' : '111111'

// Development
// export const baseURL = 'http://127.0.0.1:9005/manager/api'
// export const defaultAccount = 'system'
// export const defaultPassword = '111111'

// Production
// export const baseURL = '/manager/api'
// export const defaultAccount = ''
// export const defaultPassword = ''
