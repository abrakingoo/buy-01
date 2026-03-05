import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);

  getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: string): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
