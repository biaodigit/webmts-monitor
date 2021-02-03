export interface SafetyConfig {
  xss: boolean | XSSOptions
  whiteList?: Array<string>
  safetyTracker?(config: SafetyReport): void
}

export interface XSSOptions {
  inline: boolean
  script: boolean
}

export interface CSRFOptions {}

export interface SafetyReport {
  id: string
  url: string
  type: string
  code: string
  cookies: string
  time: Date
  ua: string
}
