import { TestBed } from '@angular/core/testing';

import { AtsModelService } from './ats-model.service';

describe('AtsModelService', () => {
  let service: AtsModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtsModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
