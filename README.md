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

#### -t, --tag \<tag\>

As you write entries in *ntbk* you might want to group similar entries together. You can do this by using *tags*.

*ntbk* supports Twitter like hashtag syntax.

```
I really think pizza is the best! #food
```

The syntax is a word that describes your entry with a hash (#) symbol prepended. Tags can be used anywhere within your entry.

When using tags while writing your entry, you might have to escape them using the backslash (\\) character.

```
> ntbk Implemented tags in ntbk today \#dev
```

To list all *ntbk* entries containing a tag, you can use the `--tag` option:

```
> ntbk --tag food
```

As you can see in the example above, the tag option doesn't need to have the hashtag symbol prefixed when passing it a parameter.

The shorthand version of `--tag` is `-t`.

#### -m, --moments \[value_unit\]

Like a time machine, the `--moments` option allows you to relive your past entries from a year go.

```
> ntbk --moments
```

If you didn't write any entries a year ago from your current day, no problem, *ntbk* will retrieve a random moment from your entries.

The `--moments` option also allows you to pass in several time units to retrieve moments in time.

Let's say instead of a year, I wanted to relive my moments from last month, I could do this:

```
> ntbk --moments 1m
```

As you can see the syntax goes, numerical value paired with a single character unit. The units of time that `--moments` recognizes are:

```
d - day
m - month
y - year
```

The shorthand version of `--moments` is `-m`.

## Changelog

### v0.4.0 - 2016-06-15

Take a walk down memory lane with *ntbk*'s latest option `--moments`. The `--moments` option is like a time machine, retrieving entries from a year ago from your current day. For more notes on moments, check out the documentation.

[See all releases](https://github.com/michaellee/ntbk/releases).

## Credit

*ntbk* was inspired by the Python journaling app, [jrnl](https://github.com/maebert/jrnl).

## Make it better

Help make *ntbk* better. If you're handy with some JavaScript and/or Node.js, feel free to create a pull-request. You could also [create a new issue](https://github.com/michaellee/ntbk/issues/new) on GitHub. If you have any questions feel free to shoot me a tweet [@michaelsoolee](https://twitter.com/michaelsoolee).
