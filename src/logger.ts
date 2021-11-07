import chalk from "chalk";

export const chalkLog = (message: string) => {
    const formattedDate = new Date().toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
    const formatted = `[${chalk.italic(formattedDate)}] - ${chalk.blue.bold(message)}`
    console.log(formatted);
}

export const chalkError = (message: string) => {
    const formattedDate = new Date().toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
    const formatted = `[${chalk.italic(formattedDate)}] - ${chalk.red.bold(message)}`
    console.error(formatted);
}