import { PageMetaDto, PageOptionsDto } from '@common/dto';
import 'source-map-support/register';

import { SelectQueryBuilder } from 'typeorm';

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
    ): Promise<[Entity[], PageMetaDto]>;
  }
}

SelectQueryBuilder.prototype.paginate = async function <Entity>(
  this: SelectQueryBuilder<Entity>,
  pageOptionsDto: PageOptionsDto,
): Promise<[Entity[], PageMetaDto]> {
  const [items, itemCount] = await this.skip(pageOptionsDto.skip)
    .take(pageOptionsDto.take)
    .getManyAndCount();

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [items, pageMetaDto];
};
