export function convertToCSV(arr) {
    arr.forEach(item=>{
        Object.keys(arr[0]).forEach(champ => {
            item[champ]=item[champ]?item[champ].toString().trim():item[champ]
          });
      })
      const array = [Object.keys(arr[0])].concat(arr)
      return array.map(it => {
          return Object.values(it).join(';').toString()
      }).join('\n')
  }