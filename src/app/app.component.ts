import { Component, OnInit, VERSION } from '@angular/core';
declare let loadPyodide: any;
const PYODIDE_BASE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.19.0/full/';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoading = false;
  pythonText = "print('Hi')";

  ngOnInit() {
    if (!globalThis.__pyodide_module) {
      this.loadPy();
    }
  }

  async loadPy() {
    this.isLoading = true;
    loadPyodide({ indexURL: PYODIDE_BASE_URL }).then((pyodide) => {
      globalThis.pyodide = pyodide;
      this.isLoading = false;
    });
  }

  async runPython() {
    globalThis.pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
    `);
    var ip = document.getElementsByClassName('output');
    const exps = globalThis.pyodide.runPython(this.pythonText);
    var stdout = globalThis.pyodide.runPython('sys.stdout.getvalue()');
    alert(stdout);
    if (stdout != '') {
      ip[0].textContent = stdout;
    } else {
      ip[0].textContent = exps;
    }
  }
}
