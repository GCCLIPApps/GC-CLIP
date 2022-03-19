import { trigger, transition, style, animate, query,stagger } from '@angular/animations';


export class Animations{

    fadeAnimation = trigger('listAnimation', [
        transition('* <=> *', [
          style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))]
        ),
        transition(':leave',
          [style({ opacity: 1 }), animate('500ms', style({ opacity: 0 }))]
        )
      ]);

    listAnimation = trigger('listAnimation', [
        transition('* <=> *', [
          query(':enter',
            [style({ opacity: 0 }), stagger('100ms', animate('500ms ease-out', style({ opacity: 1 })))],
            { optional: true }
          ),
          query(':leave',
            animate('200ms', style({ opacity: 0 })),
            { optional: true }
          )
        ])
      ]);
}