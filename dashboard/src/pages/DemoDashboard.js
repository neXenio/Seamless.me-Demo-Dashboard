// import "../helper/seamles-dashboard";
import { useTitle } from "../hooks/useTitle";
import nexenioLogoSrc from "../svg/nexenio-logo-black.svg";
import seamlessLogoSrc from "../svg/seamlessme-logo.svg";
import "./styles.css";

export const DemoDashboard = () => {
  useTitle("SeamlessMe - Demo Dashboard");

  return (
    <main class="grey lighten-4">
      <header class=" grey lighten-3 z-depth-1 header">
        <div class="row">
          <div class="col s6 m6 l4 offset-s0 offset-m0 offset-l2 left-align">
            <img alt="powered by neXenio" src={seamlessLogoSrc} height="60" />
          </div>
          <div class="col s6 m6 l4 offset-s0 offset-m0 offset-l0 right-align">
            <img alt="powered by neXenio" src={nexenioLogoSrc} height="60" />
          </div>
        </div>
      </header>

      {/* Header */}
      <div class="row">
        <div class="col">
          <button
            class="btn btn-small waves-effect waves-light"
            type="button"
            // eslint-disable-next-line no-undef
            onClick={() => toggleRendering()}
            id="renderBtn"
          >
            Pause
          </button>
        </div>

        <div class="col">
          <button
            class="btn btn-small waves-effect waves-light"
            type="button"
            // eslint-disable-next-line no-undef
            onClick={() => resetChart()}
          >
            Reset Live Stream
          </button>
        </div>

        <div class="col right">
          <a
            class="waves-effect waves-light btn btn-small modal-trigger"
            href="#configModal"
          >
            Configuration
          </a>

          <div id="configModal" class="modal">
            <div class="modal-content">
              <h3>Data Source</h3>
              <p>Select a device and the type of data you want to visualize.</p>
              <br />
              <div class="input-field">
                <select id="deviceIdSelect">
                  <option value="" disabled selected>
                    Select a device
                  </option>
                </select>
                <label>Device</label>
              </div>
              <br />
              <div class="input-field">
                <select id="dataIdSelect">
                  <option value="" disabled selected>
                    Select a data type
                  </option>
                </select>
                <label>Data</label>
              </div>
            </div>
            <div class="modal-footer">
              <a
                href="#!"
                class="modal-close waves-effect waves-green btn-flat"
              >
                Close
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* live Stream */}
      <div class="row">
        <div class="col s12">
          <ul class="collapsible expandable white">
            <li class="active">
              <div class="collapsible-header">
                <i class="material-icons">show_chart</i>Live Stream
              </div>
              <div class="collapsible-body">
                <div id="chart-plot-container"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* User Charts */}
      <div class="row">
        <div class="col s12 m6">
          <div class="card">
            <div class="card-content">
              <span class="card-title">
                <div class="row">
                  <div class="col">
                    <i class="material-icons">scatter_plot</i>
                  </div>
                  <div class="col">User A Chart</div>
                  <div class="col right">
                    <button
                      class="btn btn-small waves-effect waves-light red"
                      type="button"
                      // eslint-disable-next-line no-undef
                      onClick={() => reset("userAChart")}
                    >
                      <i class="material-icons">delete</i>
                    </button>
                  </div>
                  <div class="col right">
                    <button
                      class="btn btn-small waves-effect waves-light"
                      type="button"
                      // eslint-disable-next-line no-undef
                      onClick={() => changeUser("userAChart")}
                    >
                      <span>Save Stream</span>
                    </button>
                  </div>
                </div>
              </span>
              <div id="userAChart"></div>
            </div>
          </div>
        </div>

        <div class="col s12 m6">
          <div class="card">
            <div class="card-content">
              <span class="card-title">
                <div class="row">
                  <div class="col">
                    <i class="material-icons">scatter_plot</i>
                  </div>

                  <div class="col">User B Chart</div>

                  <div class="col right">
                    <button
                      class="btn btn-small waves-effect waves-light red"
                      type="button"
                      // eslint-disable-next-line no-undef
                      onClick={() => reset("userBChart")}
                    >
                      <i class="material-icons">delete</i>
                    </button>
                  </div>
                  <div class="col right">
                    <button
                      class="btn btn-small waves-effect waves-light"
                      type="button"
                      // eslint-disable-next-line no-undef
                      onClick={() => changeUser("userBChart")}
                    >
                      Save Stream
                    </button>
                  </div>
                </div>
              </span>
              <div id="userBChart"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer class="container">
        <div class="row white">
          <div class="col s12" />
          <div class="col">
            <h6 class="card-title truncate">Seamless.me Demo</h6>
          </div>
          <div class="col">
            <a
              href="https://github.com/neXenio/BAuth-Demo-Dashboard"
              target="_blank"
              class="btn btn-small waves-effect waves-light light-blue"
              rel="noreferrer"
            >
              GitHub Repo
            </a>
          </div>

          <div class="col s12">
            <p>
              This is a simple tool to visualize data aggregated by the
              Seamless.me app in real-time.
            </p>
            <p>
              Keep in mind that only demo builds of the Seamless.me app can be
              configured to stream data to the demo server.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};
