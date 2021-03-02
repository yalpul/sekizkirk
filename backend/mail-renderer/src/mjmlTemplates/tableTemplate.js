import Handlebars, { compile } from "handlebars";

Handlebars.registerHelper("safeVal", function (value, safeValue) {
  const out = value || safeValue;
  return new Handlebars.SafeString(out);
});

export default compile(` 
  <mjml>
  <mj-head>
    <mj-title>Sekizkirk.io - Here is your schedule.</mj-title>
    <mj-font name="Agrandir" href="https://cash-f.squarecdn.com/static/fonts/agrandir/Agrandir-GrandHeavy.woff" />
    <mj-style>
      .table-container div { margin-top: 10px !important; } .day-cell { color:
      #000000de; padding: 10px !important; font-family: "Agrandir"; font-weight:
      700 } .slot-cell { font-family: "Agrandir"; font-weight: 100;
      text-transform: uppercase; color: #FFF; border-radius: 5px; text-align:
      center; padding: 5px; } .table table { border-collapse: separate;
      border-spacing: 2px 2px }
    </mj-style>
  </mj-head>

  <mj-body background-color="#e5e5e5">
    <!-- Sekizkirk header -->
    <mj-section background-color="#000">
      <mj-column>
        <mj-text
          font-size="20px"
          color="#FFF"
          align="center"
          font-family="Agrandir"
        >
          <h1>SEKIZKIRK</h1>
        </mj-text>
      </mj-column>
    </mj-section>

    <mj-section css-class="table-container">
      <mj-column>
        <mj-table css-class="table">
          <!-- days rows -->
          <tr>
            <th class="day-cell"></th>
            <th class="day-cell">Mon</th>
            <th class="day-cell">Tue</th>
            <th class="day-cell">Wed</th>
            <th class="day-cell">Thu</th>
            <th class="day-cell">Fri</th>
          </tr>

          <!-- 8:40 -->
          <tr>
            <td class="day-cell">8:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg0-0 '#e5e5e5'}}">{{0-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg0-1 '#e5e5e5'}}">{{0-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg0-2 '#e5e5e5'}}">{{0-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg0-3 '#e5e5e5'}}">{{0-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg0-4 '#e5e5e5'}}">{{0-4}}</td>
          </tr>

          <!-- 9:40 -->
          <tr>
            <td class="day-cell">9:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg1-0 '#e5e5e5'}}">{{1-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg1-1 '#e5e5e5'}}">{{1-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg1-2 '#e5e5e5'}}">{{1-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg1-3 '#e5e5e5'}}">{{1-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg1-4 '#e5e5e5'}}">{{1-4}}</td>
          </tr>

          <!-- 10:40 -->
          <tr>
            <td class="day-cell">10:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg2-0 '#e5e5e5'}}">{{2-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg2-1 '#e5e5e5'}}">{{2-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg2-2 '#e5e5e5'}}">{{2-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg2-3 '#e5e5e5'}}">{{2-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg2-4 '#e5e5e5'}}">{{2-4}}</td>
          </tr>

          <!-- 11:40 -->
          <tr>
            <td class="day-cell">11:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg3-0 '#e5e5e5'}}">{{3-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg3-1 '#e5e5e5'}}">{{3-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg3-2 '#e5e5e5'}}">{{3-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg3-3 '#e5e5e5'}}">{{3-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg3-4 '#e5e5e5'}}">{{3-4}}</td>
          </tr>

          <!-- 12:40 -->
          <tr>
            <td class="day-cell">12:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg4-0 '#e5e5e5'}}">{{4-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg4-1 '#e5e5e5'}}">{{4-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg4-2 '#e5e5e5'}}">{{4-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg4-3 '#e5e5e5'}}">{{4-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg4-4 '#e5e5e5'}}">{{4-4}}</td>
          </tr>

          <!-- 13:40 -->
          <tr>
            <td class="day-cell">13:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg5-0 '#e5e5e5'}}">{{5-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg5-1 '#e5e5e5'}}">{{5-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg5-2 '#e5e5e5'}}">{{5-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg5-3 '#e5e5e5'}}">{{5-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg5-4 '#e5e5e5'}}">{{5-4}}</td>
          </tr>

          <!-- 14:40 -->
          <tr>
            <td class="day-cell">14:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg6-0 '#e5e5e5'}}">{{6-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg6-1 '#e5e5e5'}}">{{6-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg6-2 '#e5e5e5'}}">{{6-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg6-3 '#e5e5e5'}}">{{6-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg6-4 '#e5e5e5'}}">{{6-4}}</td>
          </tr>

          <!-- 15:40 -->
          <tr>
            <td class="day-cell">15:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg7-0 '#e5e5e5'}}">{{7-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg7-1 '#e5e5e5'}}">{{7-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg7-2 '#e5e5e5'}}">{{7-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg7-3 '#e5e5e5'}}">{{7-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg7-4 '#e5e5e5'}}">{{7-4}}</td>
          </tr>

          <!-- 16:40 -->
          <tr>
            <td class="day-cell">15:40</td>
            <td class="slot-cell" style="background-color: {{safeVal bg8-0 '#e5e5e5'}}">{{8-0}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg8-1 '#e5e5e5'}}">{{8-1}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg8-2 '#e5e5e5'}}">{{8-2}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg8-3 '#e5e5e5'}}">{{8-3}}</td>
            <td class="slot-cell" style="background-color: {{safeVal bg8-4 '#e5e5e5'}}">{{8-4}}</td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>

    <mj-section>
      <mj-column>
        <mj-divider
          border-width="2px"
          border-style="solid"
          border-color="lightgrey"
        />
      </mj-column>
    </mj-section>

    <!-- call to action -->
    <mj-section padding="0">
      <mj-column>
        <mj-text
          font-family="Agrandir"
          font-size="18px"
          align="center"
          padding="0px"
          font-weight="700"
        >
          To make any changes in your schedule
        </mj-text>
      </mj-column>
    </mj-section>

    <!-- button -->
    <mj-section>
      <mj-column>
        <mj-button
          font-family="Agrandir"
          background-color="#fca311"
          color="white"
          href="https://sekizkirk.io"
        >
          Go to site
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`);
