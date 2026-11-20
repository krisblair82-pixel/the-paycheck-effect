/*
  THE PAYCHECK EFFECT
  ------------------------------------------------------
  EDITABLE MODEL ASSUMPTIONS live in CONFIG below.
  This simulation is intentionally illustrative, not an official payroll calculator.
*/
const CONFIG = {
  rentMonthly: 2118,
  rentHalf: 1059,
  june4Gross: 1400,
  june4CashAfterRentReserve: 341,
  june17Gross: 1400,
  june17BenefitCatchupAndCurrent: 480,
  june17CurrentPera: 154,
  peraCatchup: 242,
  imputedTaxCatchup: 305,
  oasdiRefund: 136,
  june17NetEstimate: 355,
  ongoingNetEstimate: 1025,
  groceryTwoWeeks: 472,
  gasTwoWeeks: 32,
  tutor: 26,
  rootCanalEmployee: 315,
  crownEmployee: 702,
  missedBenefitPremium: 240,
  normalBenefitDeduction: 120,
  benefitRecoveryMultiplier: 1.5
};

const app = document.querySelector('#app');
const assumptionsButton = document.querySelector('#assumptionsButton');
const homeLink = document.querySelector('#homeLink');
const money = n => `$${Math.max(0, Math.round(n)).toLocaleString('en-US')}`;

let state;
function resetState(){
  state = {
    cash:0, day:0, payPeriod:0, scenarioIndex:0, lateFees:0, missed:[], spending:[], choices:[],
    rentArrears:0, rootCanal:false, crown:false, gameOver:false, totalBenefitCatchup:240,
    currentPayday:'June 17'
  };
}
resetState();

function shell(inner){ app.innerHTML = inner; app.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'smooth'}); }
function button(title, detail, action, cls=''){return `<button class="btn ${cls}" data-action="${action}" type="button"><strong>${title}</strong>${detail?`<span>${detail}</span>`:''}</button>`}
function card(x, cls=''){return `<section class="card ${cls}">${x}</section>`}
function ledger(rows){return `<div class="ledger">${rows.map(r=>`<div class="row ${r.total?'total':''}"><span>${r[0]}</span><strong class="${r[2]||''}">${r[1]}</strong></div>`).join('')}</div>`}

function landing(){
  shell(`<div class="hero"><div class="eyebrow">Leadership simulation</div><h1>The Paycheck Effect</h1><p class="lead">You have a new job, a family of four, and a normal life outside of work. See how your first few months at CU affect your household budget.</p>${card(`<h2>Your starting point</h2><p>You were hired to work at the <strong>University of Colorado</strong>. CU now has a biweekly pay schedule.</p><p>You were hired on <strong>May 1</strong>, so you are eligible for benefits immediately. Starting a new job is busy. Between learning your role, meeting coworkers and getting through onboarding, you <strong>forgot to elect your benefits</strong>.</p>${button('Begin the experience','Start with your first paycheck','may21','primary')}`)}<p class="note center">No personal information is collected or saved.</p></div>`);
}
function may21(){shell(card(`<div class="eyebrow">Paycheck 1</div><h2>May 21</h2><div class="money">$800</div><p>Earnings. Your benefit elections have not been processed, so no benefit premiums are deducted.</p><div class="consequence">This paycheck goes toward <strong>May rent and living expenses</strong>. Nothing is left to carry into June.</div>${button('Continue to June 4','Your second paycheck','june4','primary')}`));}
function june4(){shell(card(`<div class="eyebrow">Paycheck 2</div><h2>June 4</h2><div class="money">$1,400</div><p>Your benefit deductions still have not started. Your May premiums remain outstanding.</p>${ledger([['Average Denver 2-bedroom rent',money(CONFIG.rentMonthly)],['Set aside half for June rent',`−${money(CONFIG.rentHalf)}`,'negative'],['Cash remaining from this check',money(CONFIG.june4CashAfterRentReserve),'positive']])}<p class="note">The remaining $${CONFIG.june4CashAfterRentReserve} stays available. It does not disappear from the simulation.</p>${button('Continue','','retirement','primary')}`));}
function retirement(){shell(card(`<div class="eyebrow">Mandatory retirement</div><p>You were eligible to get the PERA Choice election and</p><h2>You forgot to elect a mandatory retirement plan.</h2><p>You are defaulted into the <strong>PERA Defined Benefit (PERA DB) plan</strong>.</p><p>The retirement contributions that should have been deducted from your previous paychecks will be taken from your next paycheck. You will also be reimbursed for the OASDI (Social Security) contributions paid on those earlier checks.</p>${button('Continue','You still need to elect your benefits','benefits','primary')}`));}
function benefits(){shell(card(`<div class="eyebrow">Benefit elections</div><h2>You finally had a chance to elect your benefits.</h2><p>Your <strong>fiancé</strong> recently lost her job, so you add her to your medical plan because she does not currently have health insurance.</p><p>Your coverage is effective back to your eligibility date, so the premiums that were not collected from your earlier paychecks are still owed.</p>${button('See your June 17 paycheck','The catch-up deductions are applied','june17','primary')}`));}
function june17(){
  const available = CONFIG.june4CashAfterRentReserve + CONFIG.june17NetEstimate;
  shell(`<div class="grid">${card(`<div class="eyebrow">Paycheck 3</div><h2>June 17: the catch-up paycheck</h2><div class="money">${money(CONFIG.june17Gross)}</div><p>Gross earnings</p>${ledger([['May + June insurance premiums',`−${money(CONFIG.june17BenefitCatchupAndCurrent)}`,'negative'],['Current PERA DB',`−${money(CONFIG.june17CurrentPera)}`,'negative'],['Prior PERA catch-up',`−${money(CONFIG.peraCatchup)}`,'negative'],['Estimated tax from 2 months of imputed income',`−${money(CONFIG.imputedTaxCatchup)}`,'negative'],['OASDI reimbursement',`+${money(CONFIG.oasdiRefund)}`,'positive']])}`)}${card(`<div class="eyebrow">Estimated paycheck</div><div class="money">${money(CONFIG.june17NetEstimate)}</div>${ledger([['Cash left from June 4',money(CONFIG.june4CashAfterRentReserve)],['June 17 paycheck',`+${money(CONFIG.june17NetEstimate)}`],['Cash available',money(available),'positive',true]])}<p>You still owe the other half of June rent: <strong>${money(CONFIG.rentHalf)}</strong>.</p>${button('Try to make it to the next paycheck',`${money(available)} available`,'start','primary')}`)}</div>`);
}

const baseScenarios = [
  {title:'June rent is due', text:()=>`Your two-bedroom apartment costs ${money(CONFIG.rentMonthly)} per month. You already set aside ${money(CONFIG.rentHalf)}. You still owe another ${money(CONFIG.rentHalf)}, but you only have ${money(state.cash)} available.`, choices:[
    ['Pay everything you have toward rent','You will still owe the balance and have $0 left.','rentAll'],
    ['Pay $500 toward rent','Keep some cash for food and transportation, but fall further behind.','rent500'],
    ['Pay rent late','Keep your cash for now and incur a $75 late fee.','rentLate'] ]},
  {title:'Your family needs groceries', text:()=>`There are four people in your household: you, your fiancé and two children. A USDA Thrifty food budget is approximately ${money(CONFIG.groceryTwoWeeks)} for two weeks.`, choices:[
    [`Buy two weeks of groceries — ${money(CONFIG.groceryTwoWeeks)}`,'Stay within a basic, low-cost food budget.','groceryFull'],
    ['Spend $300','Cut the grocery budget significantly.','grocery300'],
    ['Spend $150','Buy essentials and stretch what you already have.','grocery150'] ]},
  {title:'Your child has a birthday party', text:()=>`One of your children is invited to a classmate's birthday party and needs to bring a present.`, choices:[
    ['Buy a present — $20','Your child attends with a gift.','spend20'],
    ['Send your child without a present','They can attend, but it may feel uncomfortable.','missPartyGift'],
    ['Keep your child home','Save the money, but they miss the party.','missParty'] ]},
  {title:'Your new team is going to lunch', text:()=>`You have only been at CU a few weeks. Your coworkers invite you to lunch — one of your first opportunities to get to know the team outside the office.`, choices:[
    ['Go to lunch — $18','Join your new coworkers.','spend18'],['Decline','Eat what you brought and save the money.','missLunch'] ]},
  {title:'You need to get to work', text:()=>`Using the Denver South commuter benchmark and current Colorado gas price, we model about ${money(CONFIG.gasTwoWeeks)} in fuel for two weeks of commuting in a 25 MPG vehicle.`, choices:[
    [`Buy ${money(CONFIG.gasTwoWeeks)} of gas`,'Cover the modeled commute.','gasFull'],['Spend $15','Try to stretch it until payday.','gas15'] ]},
  {title:'Your child needs help with math', text:()=>`Your child loves reading and writing, but math is harder. Their teacher says they could use extra help. A Denver math tutor averages about ${money(CONFIG.tutor)} per hour.`, choices:[
    [`Hire a tutor — ${money(CONFIG.tutor)}`,'Get them an hour of extra math help.','tutor'],['Help them yourself — $0','Save the money, but first see if you can solve the homework.','math'] ]},
  {title:'Your tooth is getting worse', text:()=>`Your dentist says you need a root canal and crown. Using Colorado average costs and the cost shares supplied for this scenario, your estimated share is ${money(CONFIG.rootCanalEmployee)} for the root canal and ${money(CONFIG.crownEmployee)} for the crown.`, choices:[
    [`Get the root canal — ${money(CONFIG.rootCanalEmployee)}`,'Treat the tooth now. The crown will still be needed.','rootCanal'],['Delay treatment','Keep the cash and continue dealing with the tooth.','missDental'] ]},
  {title:'Your child needs new shoes', text:()=>`One of your children has outgrown their shoes.`, choices:[['Buy new shoes — $45','Replace them now.','spend45'],['Make the current pair last','Put the purchase off.','missShoes']]},
  {title:'The weekend arrives', text:()=>`Your family wants to do something together after a stressful couple of weeks.`, choices:[['Family outing — $35','Choose an inexpensive activity together.','spend35'],['Find something free','Preserve your remaining cash.','freeOuting']]}
];
const recurringScenarios = [
  {title:'Rent is coming again', text:()=>`Another ${money(CONFIG.rentMonthly)} rent payment is approaching. Ideally you would reserve ${money(CONFIG.rentHalf)} from this paycheck.`, choices:[[`Set aside ${money(CONFIG.rentHalf)}`,'Keep rent on track.','rentReserveFull'],['Set aside $500','Keep more cash now, but fall behind on rent.','rentReserve500']]},
  {title:'Groceries again', text:()=>`Your family of four needs another two weeks of food.`, choices:[[`Budget ${money(CONFIG.groceryTwoWeeks)}`,'Use the USDA Thrifty estimate.','groceryFull'],['Spend $300','Cut back.','grocery300'],['Spend $150','Essentials only.','grocery150']]},
  {title:'Transportation', text:()=>`You need another ${money(CONFIG.gasTwoWeeks)} for the modeled two-week commute.`, choices:[[`Spend ${money(CONFIG.gasTwoWeeks)}`,'Cover commuting fuel.','gasFull'],['Spend $15','Stretch it.','gas15']]},
  {title:'A school expense comes home', text:()=>`One of your children has a $25 school activity fee due this week.`, choices:[['Pay $25','They participate.','spend25'],['Say no this time','Preserve the cash.','missSchool']]},
  {title:'An ordinary family expense', text:()=>`The household needs toiletries, laundry supplies and a few basics.`, choices:[['Buy the supplies — $60','Cover the ordinary expense.','spend60'],['Put it off','Wait until another paycheck.','missHousehold']]}
];

function hud(){return `<div class="hud"><div><small>Cash available</small><div class="money">${money(state.cash)}</div></div><div><strong>Day ${state.day}</strong><br><small>Pay period ${state.payPeriod + 1}</small></div></div>`}
function startGame(){state.cash=CONFIG.june4CashAfterRentReserve+CONFIG.june17NetEstimate;state.day=1;state.payPeriod=0;state.scenarioIndex=0;showScenario();}
function record(label,cost,category){if(cost>0){state.spending.push({label,cost,category});state.cash=Math.max(0,state.cash-cost)}state.choices.push(label)}
function miss(label){state.missed.push(label);state.choices.push(label)}
function checkZero(){if(state.cash<=0){outOfMoney();return true}return false}
function showScenario(){
  const list=state.payPeriod===0?baseScenarios:recurringScenarios;
  if(state.scenarioIndex>=list.length){payday();return}
  const s=list[state.scenarioIndex];
  const pct=Math.min(100,((state.scenarioIndex+1)/list.length)*100);
  shell(`${hud()}${card(`<div class="eyebrow">Life keeps happening</div><h2 class="choice-title">${s.title}</h2><p>${s.text()}</p><div class="progress" aria-label="Progress through this pay period"><span style="width:${pct}%"></span></div>`)}<section aria-label="Choices">${s.choices.map(c=>button(c[0],c[1],c[2])).join('')}</section>`);
}
function advance(){state.scenarioIndex++;state.day+=Math.max(1,Math.floor(14/(state.payPeriod===0?baseScenarios.length:recurringScenarios.length)));if(!checkZero())showScenario()}
function mathChallenge(){shell(`${hud()}${card(`<div class="eyebrow">Help with homework</div><h2>Can you solve it?</h2><p>You chose to help your child yourself.</p><div class="center" style="font-size:2.5rem;font-weight:900;margin:30px 0">x + 9 = 18 + 2x</div><div class="grid">${button('x = 5','', 'mathWrong')}${button('x = −9','', 'mathRight')}${button('x = 7','', 'mathWrong')}${button('x = 2','', 'mathWrong')}</div>`)}`)}
function mathResult(correct){shell(`${hud()}${card(correct?`<h2>Nice work.</h2><p><strong>x = −9.</strong> You helped with tonight's homework and saved the tutoring cost.</p>${button('Continue','Back to the rest of the pay period','advance','primary')}`:`<h2>Not quite.</h2><p>Your child still needs help understanding the assignment.</p>${button(`Hire the tutor — ${money(CONFIG.tutor)}`,'Get the extra help.','tutorAfter')}${button('Keep trying yourself','Save the money, but your child may continue struggling.','missTutor')}`)}`)}

function payday(){
  state.payPeriod++;
  state.currentPayday=`Paycheck ${state.payPeriod+3}`;
  state.cash+=CONFIG.ongoingNetEstimate;
  state.scenarioIndex=0;
  shell(`${hud()}${card(`<div class="eyebrow">Payday</div><h2>The catch-up is over, but regular deductions continue.</h2><p>This paycheck includes regular benefits, current PERA and ongoing imputed-income taxation, but no prior-period PERA or benefit catch-up.</p>${ledger([['Illustrative ongoing net paycheck',`+${money(CONFIG.ongoingNetEstimate)}`,'positive'],['Cash now available',money(state.cash),'positive',true]])}${button('Keep going','Life continues until the money runs out','continuePeriod','primary')}`)}`)
}

function outOfMoney(){
  state.gameOver=true;
  const totals={Housing:0,Food:0,Transportation:0,Healthcare:0,Children:0,Social:0,Household:0};
  state.spending.forEach(x=>{totals[x.category]=(totals[x.category]||0)+x.cost});
  shell(`${card(`<div class="eyebrow">The paycheck effect</div><h1>You're out of money.</h1><p class="lead">It has been <strong>${state.day} days</strong> since the June 17 catch-up paycheck.</p>`, 'danger-box')}
  <div class="grid three">${card(`<label>Cash available</label><div class="money small">$0</div>`)}${card(`<label>Late fees</label><div class="money small">${money(state.lateFees)}</div>`)}${card(`<label>Needs delayed or missed</label><div class="money small">${state.missed.length}</div>`)}</div>
  ${card(`<h2>Where did the money go?</h2><table><thead><tr><th>Category</th><th>Spent</th></tr></thead><tbody>${Object.entries(totals).filter(x=>x[1]>0).map(([k,v])=>`<tr><td>${k}</td><td>${money(v)}</td></tr>`).join('')}</tbody></table><p class="note">This summary reflects the choices you made in the simulation.</p>`)}
  ${card(`<div class="eyebrow">Now change only the benefit recovery method</div><h2>Standardized 1.5× Recovery</h2><ul><li>Missed <strong>benefit deductions only</strong> are recovered by limiting the total benefit deduction to 1.5× the normal per-paycheck benefit deduction.</li><li>With a normal benefit deduction of <strong>${money(CONFIG.normalBenefitDeduction)}</strong>, the employee pays the normal ${money(CONFIG.normalBenefitDeduction)} plus <strong>${money(CONFIG.normalBenefitDeduction * (CONFIG.benefitRecoveryMultiplier-1))}</strong> toward the missed premium each paycheck.</li><li>Any remaining missed premium automatically carries forward until fully recovered.</li><li>PERA catch-up, current PERA, imputed-income taxation and other payroll items are unchanged.</li></ul>${button('Compare the recovery method','Apply flat 1.5× benefit recovery to the June 17 paycheck','compare','gold')}`)}
  ${button('Play again','Make different choices','restart')}`);
}

function compareRecovery(){
  /* Benefit-only counterfactual.
     Current model: the full $240 missed benefit premium is recovered on June 17.
     Flat 1.5x recovery: normal per-paycheck benefit deduction is $120, so total benefits
     are limited to $180: $120 current + $60 catch-up. The remaining missed premium carries forward.
     PERA, imputed-income taxation and all other payroll items remain unchanged.
  */
  const originalNet=CONFIG.june17NetEstimate;
  const missedBenefit=CONFIG.missedBenefitPremium;
  const catchupPerPaycheck=CONFIG.normalBenefitDeduction*(CONFIG.benefitRecoveryMultiplier-1);
  const actualCatchup=Math.min(missedBenefit,catchupPerPaycheck);
  const reductionInRecovery=missedBenefit-actualCatchup;
  const altNet=originalNet+reductionInRecovery;
  const carry=missedBenefit-actualCatchup;
  const futureCatchupChecks=Math.ceil(carry/catchupPerPaycheck);
  shell(`${card(`<div class="eyebrow">Benefit-only policy comparison</div><h1>Same amount owed. Different timing.</h1><p class="lead">All PERA and imputed-income assumptions remain unchanged. Only the missed benefit premium recovery changes.</p>`, 'good-box')}
  <div class="grid">${card(`<h3>Current modeled recovery</h3>${ledger([['June 17 estimated net pay',money(originalNet)],['Missed benefit premium collected',money(missedBenefit)],['Missed benefit premium carried forward','$0']])}`)}${card(`<h3>Flat 1.5× recovery</h3>${ledger([['June 17 estimated net pay',money(altNet),'positive'],['Normal benefit deduction',money(CONFIG.normalBenefitDeduction)],['Benefit catch-up collected',money(actualCatchup)],['Total benefit deduction',money(CONFIG.normalBenefitDeduction+actualCatchup)],['Missed benefit premium carried forward',money(carry)]])}`)}</div>
  ${card(`<h2>What changes?</h2><p>The employee keeps <strong>${money(reductionInRecovery)} more</strong> in the June 17 paycheck because only ${money(actualCatchup)} of the missed premium is recovered instead of ${money(missedBenefit)}.</p><p>The remaining <strong>${money(carry)}</strong> carries forward. At ${money(catchupPerPaycheck)} of additional catch-up per paycheck, it would take approximately <strong>${futureCatchupChecks} more paychecks</strong> to finish recovering that balance, assuming no new missed deductions.</p><p><strong>Nothing is forgiven.</strong> The full missed benefit premium is still recovered; only the timing changes.</p><p class="note">This is an illustrative comparison based on the scenario's simplified payroll assumptions, not an official CU payroll calculation.</p>`)}
  ${button('Review assumptions & sources','See the data behind the simulation','assumptions','primary')}${button('Play again','Try another path','restart')}`)
}
function assumptions(){
  shell(`<div class="hero"><div class="eyebrow">Transparency</div><h1>Assumptions &amp; sources</h1><p class="lead">The simulation intentionally uses conservative, visible assumptions so the experience can be challenged, refined and updated.</p>
  ${card(`<h2>Scenario assumptions</h2><table><tbody>
  <tr><th>Household</th><td>Employee, fiancé and two children.</td></tr>
  <tr><th>Housing</th><td>Denver 2-bedroom average: <strong>${money(CONFIG.rentMonthly)}/month</strong>.</td></tr>
  <tr><th>Food</th><td><strong>${money(CONFIG.groceryTwoWeeks)}</strong> for two weeks, modeled from the USDA Thrifty Food Plan family-of-four benchmark discussed during development.</td></tr>
  <tr><th>Transportation</th><td>Denver South commuter benchmark; 25 MPG vehicle; current Colorado regular gas price. Modeled at about <strong>${money(CONFIG.gasTwoWeeks)}</strong> per two-week work period.</td></tr>
  <tr><th>Tutoring</th><td>Denver math tutor benchmark rounded to <strong>${money(CONFIG.tutor)}/hour</strong>.</td></tr>
  <tr><th>Dental</th><td>Colorado average root canal $1,049 and porcelain crown $1,404. Scenario applies 30% member share to root canal and 50% to crown.</td></tr>
  <tr><th>Payroll</th><td>Illustrative CU scenario supplied for this project. June 17 net pay is modeled at <strong>${money(CONFIG.june17NetEstimate)}</strong>; ongoing pay at <strong>${money(CONFIG.ongoingNetEstimate)}</strong>. These are not official payroll estimates.</td></tr>
  <tr><th>Alternative recovery</th><td>Missed benefit deductions only: flat 1.5× recovery. A normal $120 benefit deduction becomes $180 while a missed premium remains: $120 current + $60 catch-up. Other payroll corrections are unchanged.</td></tr>
  </tbody></table>`)}
  ${card(`<h2>Public sources</h2><ul class="source-list">
    <li><a href="https://www.apartments.com/rent-market-trends/denver-co/" target="_blank" rel="noopener">Apartments.com — Denver rental market trends</a>: November 2026 average 2-bedroom rent of $2,118.</li>
    <li><a href="https://gasprices.aaa.com/?fuel=Regular&state=CO" target="_blank" rel="noopener">AAA — Colorado gas prices</a>: current regular gasoline benchmark used during development.</li>
    <li><a href="https://denver-south.com/blog/2026-commuter-survey-results/" target="_blank" rel="noopener">Denver South — 2026 Commuter Survey</a>: average one-way commute of 19.5 miles. The game uses a conservative commuting-cost estimate.</li>
    <li><a href="https://www.care.com/cost/math-tutors/denver-co" target="_blank" rel="noopener">Care.com — Denver math tutor cost</a>: approximately $26/hour in 2026.</li>
    <li><a href="https://www.carecredit.com/well-u/health-wellness/what-is-a-root-canal/" target="_blank" rel="noopener">CareCredit — Root canal cost guide</a>: Colorado average $1,049.</li>
    <li><a href="https://www.carecredit.com/well-u/health-wellness/dental-crown-cost-dental-crown-financing/" target="_blank" rel="noopener">CareCredit — Dental crown cost guide</a>: Colorado porcelain crown average $1,404.</li>
    <li><a href="https://www.fns.usda.gov/cnpp/usda-food-plans-cost-food-monthly-reports" target="_blank" rel="noopener">USDA Food Plans</a>: food-at-home budget framework used for the family-of-four grocery assumption.</li>
  </ul>`)}
  ${card(`<h2>Inspiration &amp; acknowledgment</h2><p><strong>The Paycheck Effect</strong> was inspired by <a href="https://playspent.org/" target="_blank" rel="noopener">SPENT</a>, a scenario-based financial simulation created for Urban Ministries of Durham. This project uses an original University of Colorado employee scenario, calculations, content and design to explore the potential cash-flow effects of payroll catch-up deductions.</p><p>No affiliation with or endorsement by SPENT or Urban Ministries of Durham is implied.</p>`)}
  ${button('Return to the simulation','Start from the beginning','restart','primary')}</div>`)
}

function handleAction(a){
  const actions={
    may21,june4,retirement,benefits,june17,start:startGame,restart:()=>{resetState();landing()},assumptions,compare:compareRecovery,
    continuePeriod:showScenario,advance,
    rentAll:()=>{const paid=state.cash;state.rentArrears+=Math.max(0,CONFIG.rentHalf-paid);record('Paid all available cash toward rent',paid,'Housing');advance()},
    rent500:()=>{record('Paid $500 toward rent',500,'Housing');state.rentArrears+=CONFIG.rentHalf-500;miss('Rent balance carried forward');advance()},
    rentLate:()=>{state.lateFees+=75;state.rentArrears+=CONFIG.rentHalf;miss('Paid rent late');advance()},
    groceryFull:()=>{record('Bought two weeks of groceries',CONFIG.groceryTwoWeeks,'Food');advance()},
    grocery300:()=>{record('Cut groceries to $300',300,'Food');miss('Reduced grocery budget');advance()},
    grocery150:()=>{record('Cut groceries to $150',150,'Food');miss('Severely reduced grocery budget');advance()},
    spend20:()=>{record('Bought birthday gift',20,'Children');advance()},missPartyGift:()=>{miss('Sent child to party without gift');advance()},missParty:()=>{miss('Child missed birthday party');advance()},
    spend18:()=>{record('Joined coworker lunch',18,'Social');advance()},missLunch:()=>{miss('Declined coworker lunch');advance()},
    gasFull:()=>{record('Paid commuting gas',CONFIG.gasTwoWeeks,'Transportation');advance()},gas15:()=>{record('Bought only $15 of gas',15,'Transportation');miss('Reduced commuting fuel');advance()},
    tutor:()=>{record('Hired math tutor',CONFIG.tutor,'Children');advance()},math:mathChallenge,mathRight:()=>mathResult(true),mathWrong:()=>mathResult(false),tutorAfter:()=>{record('Hired math tutor after homework attempt',CONFIG.tutor,'Children');advance()},missTutor:()=>{miss('Child did not receive tutoring');advance()},
    rootCanal:()=>{record('Paid root canal share',CONFIG.rootCanalEmployee,'Healthcare');state.rootCanal=true;advance()},missDental:()=>{miss('Delayed root canal');advance()},
    spend45:()=>{record('Bought child shoes',45,'Children');advance()},missShoes:()=>{miss('Delayed child shoes');advance()},spend35:()=>{record('Family outing',35,'Social');advance()},freeOuting:()=>{state.choices.push('Chose a free family activity');advance()},
    rentReserveFull:()=>{record('Reserved half of rent',CONFIG.rentHalf,'Housing');advance()},rentReserve500:()=>{record('Reserved $500 for rent',500,'Housing');miss('Fell behind on rent reserve');advance()},
    spend25:()=>{record('Paid school activity fee',25,'Children');advance()},missSchool:()=>{miss('Child missed school activity');advance()},spend60:()=>{record('Bought household basics',60,'Household');advance()},missHousehold:()=>{miss('Delayed household supplies');advance()}
  };
  if(actions[a]) actions[a]();
}

document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b)handleAction(b.dataset.action)});
assumptionsButton.addEventListener('click',assumptions);
homeLink.addEventListener('click',e=>{e.preventDefault();resetState();landing()});
landing();
