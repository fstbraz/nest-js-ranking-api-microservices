import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from './../interfaces/challenge-status.enum';

export class ChallengeStatusValidationPipe implements PipeTransform {
  readonly permitedStates = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.isStatusValid(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.permitedStates.indexOf(status);

    return idx !== -1;
  }
}
