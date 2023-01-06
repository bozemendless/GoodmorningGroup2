class NAVBAR extends HTMLElement {
    connectedCallback() {
        this.innerHTML = 
        `
        <div class="frame">
            <div class="left" onclick="document.location.href='index.html'">台灣氣象
            </div>
            <div class="right">
                <div class="right-item" onclick="document.location.href='thirty-six-hours.html'">
                    36小時天氣預測
                </div>
                <div class="right-item" onclick="document.location.href='7DayForecasts.html'">
                    一週天氣
                </div>
                <div class="right-item" onclick="document.location.href='rainfall.html'">
                    雨量
                </div>
            </div>

            <div class="dropdown">
                <div class="hamberg-container">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="dropdown-content">
                    <div onclick="document.location.href='thirty-six-hours.html'">
                        36小時天氣預測
                    </div>
                    <div onclick="document.location.href='7DayForecasts.html'">
                        一週天氣
                    </div>
                    <div onclick="document.location.href='rainfall.html'">
                        雨量
                    </div>
                </div>
            </div>

        </div>
        `
    }
}

customElements.define('nav-bar', NAVBAR);