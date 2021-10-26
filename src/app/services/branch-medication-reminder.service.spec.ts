import { TestBed } from '@angular/core/testing';

import { BranchMedicationReminderService } from './branch-medication-reminder.service';

describe('BranchMedicationReminderService', () => {
  let service: BranchMedicationReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BranchMedicationReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
