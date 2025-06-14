import { IntersectionType } from '@nestjs/mapped-types';

import { SearchQueryDto } from './search-query.dto';
import { PaginationQueryDto } from './pagination-query.dto';

export class RequestQueryDto extends IntersectionType(
  PaginationQueryDto,
  SearchQueryDto,
) {}
