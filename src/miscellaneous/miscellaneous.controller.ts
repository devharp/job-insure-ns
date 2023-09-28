import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { State, City } from 'country-state-city';

interface StateInfo {
  name: string;
  code: string;
}

@Controller('extras')
export class MiscellaneousController {
  private readonly countryCode = 'IN';

  @Get('suggest/location')
  async suggestLocation(
    @Query('locate') locate: string,
    @Query('of') of: string,
  ): Promise<string[] | StateInfo[]> {
    if (locate !== 'country' && locate !== 'state' && locate !== 'city') {
      throw new HttpException('Invalid  parameter', HttpStatus.BAD_REQUEST);
    }
    return locate === 'state'
      ? await State.getStatesOfCountry('IN').map((e) => {
          return { name: e.name, code: e.isoCode };
        })
      : await City.getCitiesOfState(this.countryCode, of).map((e) => e.name);
  }
}
