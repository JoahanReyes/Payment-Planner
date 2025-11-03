import { Component, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  logo = '';
  user = { isLogged: true, avatarUrl: '', name: 'Joahan Reyes' };
  ismenuopen = signal(false);

  constructor() {
    //Cerrar el Menu al hacer click fuera de él
    effect(() => {
      document.addEventListener('click', (event: Event) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-toggle')) {
          this.ismenuopen.set(false);
        }
      });
    });
  }

  // Evita que el clic se propague y cierre el menú
  UserMenuToggle(event: MouseEvent) {
    event.stopPropagation();
    this.ismenuopen.update((prev) => !prev);
  }
}
