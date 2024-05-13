import { ILogger } from './logger';
import { LibraryBuilder } from './library-builder';
import { findAllLibraryPackageJson } from './files';
import { moduleFinder } from './module-finder';
import { getLibraryRootPath } from './paths';

export class ProjectBuilder {

  private libraryBuilder: LibraryBuilder[] = []

  constructor(
    private readonly logger: ILogger,
    private readonly isWatch: boolean,
    private readonly isProduction: boolean
  ) {
  }

  async build() {
    this.logger.log('build all libraries')
    const packageJsonList = await findAllLibraryPackageJson()
    this.libraryBuilder = await Promise.all(packageJsonList.map(async packageJson => {
      const name = packageJson.name
      const module = await moduleFinder(getLibraryRootPath(name));
      return new LibraryBuilder(
        this.logger.fork(name),
        name,
        this.isWatch,
        this.isProduction,
        module.length > 1
      )
    }))
    await Promise.all(this.libraryBuilder.map(builder => builder.build()))
    this.logger.log('build all libraries complete')
  }

  async terminate() {
    await Promise.all(this.libraryBuilder.map(builder => builder.terminate()))
    this.libraryBuilder = []
  }

}
