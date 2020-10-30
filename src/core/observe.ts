export default (
  entryTypes: Array<string>
): Promise<{
  ob: PerformanceObserver
  entries: PerformanceEntryList
}> => {
  let ob: PerformanceObserver, entries: PerformanceEntryList
  return new Promise((resolve, reject) => {
    ob = new PerformanceObserver(
      (entryList: PerformanceObserverEntryList) => {
        entries = entryList.getEntries()
        console.log(entries)
        resolve({ ob, entries })
      }
    )
    ob.observe({ entryTypes, buffered: true })
  })
}
