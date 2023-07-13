# read-each-line-sync

Read file line by line, synchronously.

## Install

    npm install read-each-line-sync

## Example

```javascript
var readEachLineSync = require('read-each-line-sync')

readEachLineSync('test.txt', 'utf8', function(line) {
  console.log(line)
})
```

Encoding can optionally be omitted, in which case it will default to utf8:

```javascript
readEachLineSync('test.txt', function(line) {
  console.log(line)
})
```

End-Of-Line can be specified along with encoding if necessary, otherwise it defaults to your operating system EOF:

```javascript
readEachLineSync('test.txt', 'utf-8', '\n', function(line) {
  console.log(line)
})
```


## Credits

Author: [Geza Kovacs](http://github.com/gkovacs)

Based on [readLineSync](https://gist.github.com/Basemm/9700229)

## License

MIT
