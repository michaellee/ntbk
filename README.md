# ntbk

*ntbk* is a simple command-line journaling tool written in Node.js.

## Installation

To install *ntbk* using npm:

```
npm install -g ntbk
```

## Usage

Type `ntbk` into your shell window followed by a message:

```
> ntbk 11-month-old stood up today for the first time
```

then hit enter to have the entry added to your designated notebook.

Alternatively, you can type `ntbk` and hit return and then type your message. When you're ready to save your entry, hit return again.

### Options

#### -l, --list [n]

You can see all your entries by using the `--list` option:

```
> ntbk --list
```

You can also pass a number to the `--list` option and it will return a subset of your entries. For example if you passed 2 it will return the last two *ntbk* entries.

```
> ntbk -l 2
```

The above uses the shorthand version `-l` of the `--list` option.

## Credit

*ntbk* was inspired by the Python journaling app, [jrnl](https://github.com/maebert/jrnl).

## Make it better

Help make *ntbk* better. If you're handy with some JavaScript and/or Node.js, feel free to create a pull-request. You could also [create a new issue](https://github.com/michaellee/ntbk/issues/new) on GitHub. If you have any questions feel free to shoot me a tweet [@michaelsoolee](https://twitter.com/michaelsoolee).

## License

[MIT][license] © [Michael Lee][website]

[license]: http://showalicense.com/?fullname=Michael%20Lee%20(https%3A%2F%2Fmichaelsoolee.com)&year=2016#license-mit
[website]: https://michaelsoolee.com
