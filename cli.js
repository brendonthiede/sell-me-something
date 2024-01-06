import { cards } from './docs/assets/js/cards.mjs';
import Table from 'cli-table';

let command = 'help';

if (process.argv.length > 2) {
    command = process.argv[2];
}

let args = [];
if (process.argv.length > 3) {
    args = process.argv.slice(3);
}

function usage() {
    console.log('Usage: node cli.js [command] [options]');
    console.log('Commands:');
    console.log('  help: Display help');
    console.log('  list: List all cards');
    console.log('     -o [name|table|json]: Sets the format to display the list of cards. Defaults to name.');
    console.log('     -f [customers|words|all]: Filters which cards to show. Defaults to all.');
    process.exit();
}

function printTable(cards, filter) {
    const table = new Table({
        head: ['Type', 'Text']
    });
    if (/customer[s]?/.test(filter) || filter === 'all') {
        cards.customers.forEach(card => {
            table.push(['Customer', card]);
        });
    }
    if (/word[s]?/.test(filter) || filter === 'all') {
        cards.words.forEach(card => {
            table.push(['Word', card]);
        });
    }
    console.log(table.toString());
}

function list(args) {
    let format = 'name';
    let filter = 'all';
    if (args.includes('-o')) {
        let index = args.indexOf('-o');
        if (index < args.length - 1) {
            format = args[index + 1];
        }
    }

    if (!['name', 'table', 'json'].includes(format)) {
        console.log(`Unknown format, '${format}'`);
        usage();
    }

    if (args.includes('-f')) {
        let index = args.indexOf('-f');
        if (index < args.length - 1) {
            filter = args[index + 1];
        }
    }

    if (!['customers', 'words', 'all'].includes(filter)) {
        console.log(`Unknown filter, '${filter}'`);
        usage();
    }

    switch (format) {
        case 'name':
            if (/customer[s]?/.test(filter) || filter === 'all') {
                console.log(cards.customers.join('\n'));
            }
            if (/word[s]?/.test(filter) || filter === 'all') {
                console.log(cards.words.join('\n'));
            }
            break;
        case 'table':
            printTable(cards, filter);
            break;
        case 'json':
            if (filter === 'all') {
                console.log(JSON.stringify(cards, null, 2));
            } else if (/customer[s]?/.test(filter)) {
                console.log(JSON.stringify(cards.customers, null, 2));
            } else if (/word[s]?/.test(filter)) {
                console.log(JSON.stringify(cards.words, null, 2));
            }
            break;
        default:
            console.log('Unknown format');
            usage();
            break;
    }
}

switch (command) {
    case 'help':
        usage();
        break;
    case 'list':
        list(args);
        break;
    default:
        console.log('Unknown command');
        usage();
        break;
}