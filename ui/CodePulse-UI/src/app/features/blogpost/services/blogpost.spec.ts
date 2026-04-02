import { TestBed } from '@angular/core/testing';

import { Blogpost } from './blogpost';

describe('Blogpost', () => {
  let service: Blogpost;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Blogpost);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
