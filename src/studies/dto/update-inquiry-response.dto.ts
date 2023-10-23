import { PartialType } from '@nestjs/mapped-types';
import { CreateInquiryResponseDto } from './create-inquiry-response.dto';

export class UpdateInquiryResponseDto extends PartialType(
  CreateInquiryResponseDto,
) {}
