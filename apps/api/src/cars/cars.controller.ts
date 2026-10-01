import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ImageProcessorService, MarketPriceService } from '@car-inventory/infrastructure';

@Controller('cars')
export class CarsController {
  private readonly imageProcessor = new ImageProcessorService({
    quality: Number(process.env.IMAGE_QUALITY) || 80,
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  });

  private readonly marketPriceService = new MarketPriceService();

  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|jpg)$/)) {
          return cb(new BadRequestException('فقط فایل‌های تصویری مجاز هستند'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreateCarDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    const imageFilenames: string[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const processed = await this.imageProcessor.process(file.buffer, file.originalname);
        const medium = processed.find((p) => p.size === 'medium');
        if (medium) imageFilenames.push(medium.filename);
      }
    }

    const ownerId = req.user.id;
    const car = await this.carsService.create(dto, ownerId, imageFilenames);
    return { success: true, data: car };
  }

  @Get()
  async findPublic(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('yearFrom') yearFrom?: string,
    @Query('yearTo') yearTo?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    const list = await this.carsService.findPublic({
      brand,
      model,
      yearFrom: yearFrom ? Number(yearFrom) : undefined,
      yearTo: yearTo ? Number(yearTo) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      search,
    });

    const safe = list.map((c) => ({
      ...c,
      ownerMobile: c.isPhoneVisible ? c.ownerMobile : null,
    }));

    return { success: true, data: safe, total: safe.length };
  }

  @Get('suggestions')
  async getSuggestions(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('year') year?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('excludeId') excludeId?: string,
    @Query('limit') limit?: string,
  ) {
    const list = await this.carsService.findSuggestions({
      brand,
      model,
      year: year ? Number(year) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      excludeId,
      limit: limit ? Number(limit) : 6,
    });

    const safe = list.map((c) => ({
      ...c,
      ownerMobile: c.isPhoneVisible ? c.ownerMobile : null,
    }));

    return { success: true, data: safe };
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findMy(@Request() req: any) {
    const list = await this.carsService.findByOwner(req.user.id);
    return { success: true, data: list };
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  async adminList(@Request() req: any) {
    if (req.user.role !== 'Admin') {
      return { success: false, message: 'دسترسی محدود به ادمین' };
    }
    const list = await this.carsService.findAllActive();
    return { success: true, data: list, total: list.length };
  }

  @Get(':id/price-position')
  async getPricePosition(@Param('id') id: string) {
    const car = await this.carsService.findById(id);
    if (!car || !car.isActive) {
      return { success: false, message: 'خودرو یافت نشد' };
    }

    const position = await this.marketPriceService.calculatePosition(
      car.priceAmount,
      car.brand,
      car.model,
      car.year,
    );

    return { success: true, data: position };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const car = await this.carsService.findById(id);
    if (!car || !car.isActive) {
      return { success: false, message: 'خودرو یافت نشد' };
    }
    return {
      success: true,
      data: {
        ...car,
        ownerMobile: car.isPhoneVisible ? car.ownerMobile : null,
      },
    };
  }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard)
  async updateVisibility(
    @Param('id') id: string,
    @Body('isPhoneVisible') isPhoneVisible: boolean,
    @Request() req: any,
  ) {
    const car = await this.carsService.updateVisibility(id, req.user.id, isPhoneVisible);
    return { success: true, data: car };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.carsService.softDelete(id, req.user.id);
    return { success: true, message: 'خودرو با موفقیت حذف شد' };
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  async adminRemove(@Param('id') id: string, @Request() req: any) {
    if (req.user.role !== 'Admin') {
      return { success: false, message: 'دسترسی محدود به ادمین' };
    }
    await this.carsService.adminSoftDelete(id);
    return { success: true, message: 'خودرو توسط ادمین حذف شد' };
  }
}
