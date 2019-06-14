function loadEventLogs()
{
	Homey.get('systemEventLog', function(err, eventLogs) {

		// handle error
		if (err) {
		    showMessage('error getting systemEventLog', err, 'danger');
			return;
		}

		var systemEventLogContent = document.getElementById('systemEventLogs');
		
		// check if eventLogs is loaded
		if (typeof eventLogs === 'undefined' || eventLogs === null || eventLogs.length === 0) {
			systemEventLogContent.innerText = __('settings.rfid.messages.noEventsYet');
			return;
		}

		// clear log
		systemEventLogContent.innerHTML = '';
		
		// load log
		for (var i=0; i<eventLogs.length; i++) {
			var eventLog = eventLogs[i];
			var rows = new Array();

			//add date
			var date = new Date(eventLog.time);
			rows.push({
				label: __('settings.systemEventLog.table.datetime'),
				value: date.toString()
			});

			//add event
			rows.push({
				label: __('settings.systemEventLog.table.event'),
				value: __('settings.systemEventLog.eventTypes.s' + eventLog.statusCode)
			});

			//add device
			if (eventLog.deviceId !== null || eventLog.deviceName !== null) {
				rows.push({
					label: __('settings.systemEventLog.table.device'),
					value: (eventLog.deviceName !== null ? eventLog.deviceName : eventLog.deviceId)
				});
			}

			//add tag
			rows.push({
				label: __('settings.systemEventLog.table.tagOrCode'),
				value: eventLog.tagId
			});

			//add user
			if (eventLog.userName !== null) {
				rows.push({
					label: __('settings.systemEventLog.table.person'),
					value: eventLog.userName + ' (' + eventLog.userId + ')'
				});
			}

			systemEventLogContent.appendChild(createTable(rows));
		}
	});
}

function clearEventLog()
{
	Homey.confirm(__('settings.rfid.messages.confirmClearEventLog'), 'warning', function(err, result) {
		if (result === true) {

			// reset logs
			document.getElementById('systemEventLogs').innerText = __('settings.loading');
			
			// reset systemEventLog
			Homey.set('systemEventLog', new Array());
			showMessage('', __('settings.rfid.messages.eventLogClearedConfirmation'), 'success');

			// Current page is nothing left todo, so close page and load previous page
			previousPage();
		}
	});

	// Always return false to cancel the bubbling click events.
	return false;
}

// init load event logs
loadEventLogs();