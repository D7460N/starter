import { runPipeline } from './pipeline/14-run-pipeline.js';

document
  .querySelectorAll('input')
  .forEach(input => {
    input.oninput = () => runPipeline(input.value, document);
  });
