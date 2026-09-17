const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('lib/utils.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context={exports:{},process:{env:{}}};vm.runInNewContext(code,context);
const render=context.exports.generateStyledParagraph;
const plain={highlights:[],underlines:[],emphasis:[]};
assert.equal(render(plain,0,'<script>&"'),'<span style="white-space:pre-wrap">&lt;script&gt;&amp;&quot;</span>');
const card={highlights:[[2,0,4]],underlines:[[2,3,6]],emphasis:[[2,1,5]]};
assert.equal(render(card,0,'abcdef'),'<span style="white-space:pre-wrap"><span style="background-color:yellow">a</span><span style="background-color:yellow;font-weight:bold">bc</span><span style="background-color:yellow;text-decoration:underline;font-weight:bold">d</span><span style="text-decoration:underline;font-weight:bold">e</span><span style="text-decoration:underline">f</span></span>');
assert(!render({...plain,emphasis:[[2,0,2]]},0,'ab').includes('underline'));
assert(!render({...plain,underlines:[[2,0,2]]},0,'ab').includes('font-weight'));
assert.equal(render({...plain,highlights:[[2,0,3],[2,2,4]]},0,'abcd'),'<span style="white-space:pre-wrap"><span style="background-color:yellow">ab</span><span style="background-color:yellow">c</span><span style="background-color:yellow">d</span></span>');
assert(render({...plain,highlights:[[2,1,3]]},0,'A😀B','aqua').includes('background-color:aqua">😀</span>B'));
assert(!render(card,0,'abcdef','red;position:fixed').includes('position:fixed'));
assert.equal(render({...plain,underlines:[[2,-1,2],[2,0,99],[3,0,2]]},0,'ab'),render(plain,0,'ab'));
console.log('Existing-span renderer regressions passed');
// Independent per-character oracle for arbitrary crossing/duplicate ranges.
let seed=42;
const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
for(let trial=0;trial<200;trial++){
  const text='abcdefghijklmnopqrst';
  const data={highlights:[],underlines:[],emphasis:[]};
  for(const ranges of Object.values(data))for(let j=0;j<12;j++){
    const start=random(text.length),end=start+1+random(text.length-start);
    ranges.push([2,start,end]);
  }
  const html=render(data,0,text),stack=[],actual=[];
  for(const token of html.match(/<[^>]+>|[^<]+/g)){
    if(token.startsWith('</')){assert(stack.length);stack.pop();}
    else if(token.startsWith('<'))stack.push(token);
    else for(const char of token)actual.push([char,stack.some(s=>s.includes('background-color:')),stack.some(s=>s.includes('text-decoration:underline')),stack.some(s=>s.includes('font-weight:bold'))]);
  }
  assert.equal(stack.length,0);
  const expected=Array.from(text,(char,i)=>[char,...Object.values(data).map(spans=>spans.some(([line,s,e])=>s<=i&&i<e))]);
  assert.deepEqual(actual,expected);
}
console.log('200 generated overlapping-span cases passed');
