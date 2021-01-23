export interface SecurityConfig {
  xss: boolean | XSSOptions
  whiteList: Array<string>
}

export interface XSSOptions {
  inline: boolean
  script: boolean
}

export interface CSRFOptions {}

export interface SecurityReport {
  url: string
}
