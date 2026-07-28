import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { App } from './app';
import { JobsApi } from './jobs-api';

describe('App', () => {
  const jobsApi = {
    getJobs: jasmine.createSpy('getJobs').and.returnValue(of([])),
    createJob: jasmine.createSpy('createJob'),
    updateJobStatus: jasmine.createSpy('updateJobStatus'),
    updateJobDetails: jasmine.createSpy('updateJobDetails'),
    deleteJob: jasmine.createSpy('deleteJob'),
  };

  beforeEach(async () => {
    jobsApi.getJobs.calls.reset();
    jobsApi.getJobs.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: JobsApi, useValue: jobsApi }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the job tracker title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Job Tracker');
  });
});
