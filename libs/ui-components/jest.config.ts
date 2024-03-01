import type { Config } from '@jest/types';

// Синхронная функция конфигурации Jest
const config: Config.InitialOptions = {
  verbose: true, // Выводить подробные результаты тестов
  preset: 'ts-jest', // Использовать ts-jest для транспиляции тестов TypeScript
  testEnvironment: 'node', // Установить среду выполнения тестов (можно использовать 'jsdom' для фронтенд тестирования)
  roots: ['<rootDir>/src'], // Корневые директории, в которых Jest будет искать тесты
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$', // Регулярное выражение для поиска файлов тестов
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Расширения файлов, которые будут обрабатываться
  collectCoverage: true, // Собирать информацию о покрытии кода тестами
  coverageDirectory: 'coverage', // Директория, куда будет помещен отчет о покрытии
};

export default config;