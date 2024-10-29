import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-texto',
  standalone: true,
  imports: [],
  templateUrl: './editor-texto.component.html',
  styleUrls: ['./editor-texto.component.css']
})
export class EditorTextoComponent implements OnInit {
 
  // Variables para almacenar la posición del cursor
  cursorPos = { line: 1, column: 1 };

  constructor() {}

  ngOnInit(): void {
    this.updateLineNumbers();
  }

  updateLineNumbers(): void {
    const codeArea = document.getElementById("codeArea") as HTMLTextAreaElement;
    const lineNumbers = document.getElementById("lineNumbersContent") as HTMLElement;

    if (codeArea && lineNumbers) {
      const lines = codeArea.value.split("\n").length;
      lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
    }
  }

  syncScroll(): void {
    const codeArea = document.getElementById("codeArea") as HTMLTextAreaElement;
    const lineNumbers = document.getElementById("lineNumbers") as HTMLElement;

    if (codeArea && lineNumbers) {
      lineNumbers.scrollTop = codeArea.scrollTop; // Sincronizamos el scroll del contador de líneas
    }
  }

  updateCursorPosition(event: Event): void {
    const codeArea = document.getElementById("codeArea") as HTMLTextAreaElement;
    const cursorPosition = document.getElementById("cursorPosition") as HTMLElement;

    if (codeArea && cursorPosition) {
      const textBeforeCursor = codeArea.value.substr(0, codeArea.selectionStart);
      const lines = textBeforeCursor.split("\n");

      const currentLine = lines.length;
      const currentColumn = lines[lines.length - 1].length + 1;

      this.cursorPos = { line: currentLine, column: currentColumn };
      cursorPosition.textContent = `Línea: ${this.cursorPos.line}, Columna: ${this.cursorPos.column}`;
    }
  }



  


}
