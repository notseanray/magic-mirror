<script lang="ts">
    import { onMount } from "svelte";
    import { COMPLIMENT_CYCLE_TIME, COMPLIMENT_LIST } from "./constants";
    import { dateSection, getHolidays, formatCalendarDay, weather } from "./utils";

    const setCompliment = () => {
        compliment = COMPLIMENT_LIST[Math.floor(Math.random() * COMPLIMENT_LIST.length)];
    };
    const getDate = () => {
        const d = dateSection(new Date());
        second = d.second;
        date = d.date;
        time = d.time;
    };
    let compliment = "";
    let compliment_rerender = true;
    let second;
    let time;
    let date;
    let initDate = new Date();
    let holidays = [];
    let currentWeather = "";
    getDate();
    onMount(async () => {
        holidays = await getHolidays(initDate);
        currentWeather = await weather();
        setCompliment();
        setInterval(() => {
            compliment_rerender = false;
            setCompliment();
            compliment_rerender = true;
        }, COMPLIMENT_CYCLE_TIME)
        setInterval(() => {
            getDate();
        }, 1000);
        setInterval(() => {
            weather().then((w) => {
                currentWeather = w;
            });
        }, 54000);
        setInterval(() => {
            let d = new Date();
            getHolidays(d).then((h) => {
                holidays = h;
            });
        }, 2592000);
    })
</script>

<main>
    <div class="leftPanel">
        <div class="mainDate">
            {date}
        </div>
        <div class="mainTime">
            {time}
            <div class="secondTime">
                {second}
            </div>
        </div>
        <div class="holidayTitles">
            us holidays
        </div>
        <div class="holidayLine" />
        <div class="holidayEvent">
            {#each holidays as h, i}
                {h.summary}
                <div class="right">
                    {formatCalendarDay(h.start.date)} <br />
                </div>
                <br />
            {/each}
        </div>
    </div>
    <div class="rightPanel">
        <div class="right">
            {currentWeather.location}
            <br />
            <div class="right">
                {currentWeather.data}
            </div>
        </div>
        <br />
        <div class="holidayTitles">
            weather forecast
        </div>
        <div class="weatherLine" />
    </div>
    <div class="centered">
        {#if compliment_rerender}
            <div class="compliment">{compliment}</div>
        {/if}
    </div>
</main>

<style>
    .holidayEvent {
        width: 320px;
    }
    .right {
        float: right;
    }
    .holidayLine {
        width: 320px;
        display: flex;
        border-bottom: 2px solid white;
    }
    .holidayTitles {
        font-size: 14px;
        margin-top: 2em;
        text-transform: uppercase;
        color: white;
    }
    .mainDate {
        font-size: 30px;
    }
    .mainTime {
        font-size: 40px;
        display: flex;
    }
    .secondTime {
        margin-top: 7px;
        font-size: 12px;
    }
    .leftPanel {
        margin-left: 1em;
        color: white;
    }
    .weatherLine {
        width: 320px;
        float: right;
        display: flex;
        border-bottom: 2px solid white;
    }
    .rightPanel {
        position: absolute;
        right: 0;
        top: 2em;
        color: white;
    }
    .compliment {
        margin-top: 7em;
        color: white;
        font-size: 30px;
        animation: fade 5s linear;
    }
    @keyframes fade {
      0% { opacity: 0 }
      100% { opacity: 1 }
    }
    .centered {
		text-align: center;
    }
	main {
		max-width: 240px;
        width: 100vw;
        height: 100vh;
        overflow-x: hidden;
        background: #000000;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
