import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-report-cash-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-cash-flow.component.html',
  styleUrl: './report-cash-flow.component.scss',
})
export class ReportCashFlowComponent implements OnInit {
  public utilsService = inject(UtilsService);

  ngOnInit(): void {}
}
