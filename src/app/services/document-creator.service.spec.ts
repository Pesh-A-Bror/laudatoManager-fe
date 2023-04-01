import { TestBed } from '@angular/core/testing';

import { DocumentCreatorService } from './document-creator.service';

describe('DocumentCreatorService', () => {
  let service: DocumentCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
