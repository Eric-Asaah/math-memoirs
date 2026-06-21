function renderEntryCard(entry, globalIndex, site, likes) {
  // Determine if entry is completed based on status field
  var isCompleted = entry.status === 'completed' || entry.status === 'verified' || entry.status === 'Completed';
  var pending = !isCompleted;

  // Get labels from JSON
  var entryCfg = site.entry || {};
  var completedLabel = entryCfg.statusCompleted || 'Completed';
  var inProgressLabel = entryCfg.statusInProgress || 'In progress';
  var noteLabel = entryCfg.noteLabel || 'Note on this entry';
  var manuscriptLabel = entry.manuscriptLabel || entryCfg.manuscriptLabel || 'Open manuscript';

  var card = document.createElement('article');
  card.className = 'entry-card' + (pending ? ' pending' : '');
  card.dataset.entryId = entry.id || 'entry-' + globalIndex;

  // --- Stamp on EVERY card, text from site.json ---
  var stamp = document.createElement('div');
  stamp.className = 'entry-stamp' + (pending ? ' pending' : '');
  var stampText = pending ? '⧗ ' + inProgressLabel : '✓ ' + completedLabel;
  stamp.textContent = stampText;
  card.appendChild(stamp);

  var head = document.createElement('div');
  head.className = 'entry-header';

  var num = document.createElement('span');
  num.className = 'entry-number';
  num.textContent = 'Entry ' + String(globalIndex + 1).padStart(2, '0');
  head.appendChild(num);

  if (pending) {
    var dspan = document.createElement('span');
    dspan.className = 'entry-date';
    dspan.textContent = '— ' + getYear();
    head.appendChild(dspan);
  } else if (entry.datetime) {
    var time = document.createElement('time');
    time.className = 'entry-date';
    time.dateTime = entry.datetime;
    time.textContent = formatDate(entry.datetime);
    head.appendChild(time);
  }
  card.appendChild(head);

  var h2 = document.createElement('h2');
  h2.className = 'entry-title';
  h2.textContent = entry.title || '';
  card.appendChild(h2);

  var bodyWrap = document.createElement('div');
  bodyWrap.className = 'entry-body-wrap';
  var body = document.createElement('p');
  body.className = 'entry-body';
  body.innerHTML = entry.body || '';
  bodyWrap.appendChild(body);

  var listUi = site.listUi || {};
  var bodyLimit = typeof listUi.bodyCharsBeforeToggle === 'number' ? listUi.bodyCharsBeforeToggle : 200;
  var bodyText = entry.body || '';
  if (!pending && bodyText.length > bodyLimit) {
    body.classList.add('entry-body--clamp');
    var rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'read-more-btn';
    rm.textContent = 'Read more';
    rm.addEventListener('click', function () {
      var open = card.classList.toggle('entry-card--expanded');
      rm.textContent = open ? 'Show less' : 'Read more';
    });
    bodyWrap.appendChild(rm);
  }
  card.appendChild(bodyWrap);

  var tags = document.createElement('div');
  tags.className = 'entry-tags';
  (entry.tags || []).forEach(function (t) {
    var span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    tags.appendChild(span);
  });
  card.appendChild(tags);

  // Search data
  var searchBits = [
    entry.title,
    entry.body,
    (entry.tags || []).join(' '),
    entry.pdf || '',
    entry.id || '',
    'entry ' + String(globalIndex + 1).padStart(2, '0')
  ];
  card.dataset.search = searchBits.join(' ').toLowerCase().replace(/\s+/g, ' ').trim();

  var toolbar = document.createElement('div');
  toolbar.className = 'entry-toolbar';

  var left = document.createElement('div');
  left.className = 'entry-toolbar-left';

  // Like button
  var like = document.createElement('button');
  like.type = 'button';
  like.className = 'like-btn';
  var eid = entry.id || String(globalIndex);
  var liked = !!likes[eid];
  like.setAttribute('aria-pressed', liked ? 'true' : 'false');
  like.setAttribute('aria-label', liked ? 'Unlike this entry' : 'I like this entry');
  var icon = document.createElement('span');
  icon.className = 'like-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = liked ? '♥' : '♡';
  var txt = document.createElement('span');
  txt.className = 'like-text';
  txt.textContent = liked ? 'Saved' : 'I like this';
  like.appendChild(icon);
  like.appendChild(document.createTextNode(' '));
  like.appendChild(txt);
  like.addEventListener('click', function () {
    var map = readLikes();
    var on = !map[eid];
    if (on) map[eid] = true;
    else delete map[eid];
    writeLikes(map);
    like.setAttribute('aria-pressed', on ? 'true' : 'false');
    like.setAttribute('aria-label', on ? 'Unlike this entry' : 'I like this entry');
    like.querySelector('.like-icon').textContent = on ? '♥' : '♡';
    like.querySelector('.like-text').textContent = on ? 'Saved' : 'I like this';
    showToast(on ? 'Saved only in this browser — clear site data to reset.' : 'Removed from this browser.', on ? 4200 : 2600);
  });
  left.appendChild(like);

  // "Note on this entry" — uses feedback.baseUrl from site.json
  var feedbackCfg = site.feedback || {};
  var feedbackBase = feedbackCfg.baseUrl || 'feedback.html';
  var entryFb = feedbackBase + '?entry=' + encodeURIComponent(entry.id);
  
  var ef = document.createElement('a');
  ef.className = 'btn-ghost note-on-entry';
  ef.href = entryFb;
  ef.rel = 'noopener noreferrer';
  ef.textContent = noteLabel;
  left.appendChild(ef);

  toolbar.appendChild(left);

  var right = document.createElement('div');
  right.className = 'entry-toolbar-right';

  if (!pending && entry.pdf) {
    var openA = document.createElement('a');
    openA.className = 'entry-cta entry-cta--open';
    openA.href = entry.pdf;
    openA.target = '_blank';
    openA.rel = 'noopener noreferrer';
    openA.textContent = manuscriptLabel;

    var dl = document.createElement('a');
    dl.className = 'entry-cta entry-cta--download';
    dl.href = entry.pdf;
    if (entry.download === true && entry.downloadName) {
      dl.setAttribute('download', entry.downloadName);
    } else {
      dl.setAttribute('download', pdfBasename(entry.pdf));
    }
    dl.textContent = 'Download PDF';

    right.appendChild(openA);
    right.appendChild(dl);
  } else if (pending) {
    var lock = document.createElement('span');
    lock.className = 'entry-cta';
    lock.textContent = entry.lockedLabel || 'Locked';
    right.appendChild(lock);
  }

  toolbar.appendChild(right);
  card.appendChild(toolbar);

  return card;
}
