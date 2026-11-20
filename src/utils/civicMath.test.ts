import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyAuditRating,
  applyEntityVote,
  filterAgencies,
  filterForumPosts,
  filterOfficials,
} from './civicMath';
import { AGENCIES, FORUM_POSTS, OFFICIALS } from '../data/mockData';

test('applyEntityVote toggles upvote and recalculates trustIndex', () => {
  const base = { ...OFFICIALS[0], upvotesCount: 80, downvotesCount: 20, userVote: null };
  const upvoted = applyEntityVote(base, 'up');
  assert.equal(upvoted.userVote, 'up');
  assert.equal(upvoted.upvotesCount, 81);
  assert.equal(upvoted.trustIndex, 80.2);

  const toggledOff = applyEntityVote(upvoted, 'up');
  assert.equal(toggledOff.userVote, null);
  assert.equal(toggledOff.upvotesCount, 80);
  assert.equal(toggledOff.trustIndex, 80);
});

test('applyEntityVote switches directly from up to down', () => {
  const base = { ...OFFICIALS[0], upvotesCount: 60, downvotesCount: 40, userVote: 'up' as const };
  const switched = applyEntityVote(base, 'down');
  assert.equal(switched.userVote, 'down');
  assert.equal(switched.upvotesCount, 59);
  assert.equal(switched.downvotesCount, 41);
  assert.equal(switched.trustIndex, 59);
});

test('applyAuditRating increments ratingsCount and prepends review', () => {
  const official = OFFICIALS[0];
  const updated = applyAuditRating(official, {
    overallScore: 90,
    comment: 'Strong infrastructure execution.',
    isAnonymous: true,
  });

  assert.equal(updated.ratingsCount, official.ratingsCount + 1);
  assert.equal(updated.recentReviews[0].comment, 'Strong infrastructure execution.');
  assert.equal(updated.recentReviews[0].author, 'Verified Citizen (ZK)');
  assert.ok(updated.trustIndex > official.trustIndex);
});

test('filterOfficials filters by category and search query', () => {
  const governors = filterOfficials(OFFICIALS, 'governors', '');
  assert.ok(governors.length > 0);
  assert.ok(governors.every((g) => g.category === 'governor'));

  const abia = filterOfficials(OFFICIALS, 'all', 'abia');
  assert.equal(abia.length, 1);
  assert.equal(abia[0].id, 'alex-otti');

  const noneForAgencies = filterOfficials(OFFICIALS, 'agencies', '');
  assert.equal(noneForAgencies.length, 0);
});

test('filterAgencies filters by acronym and sector', () => {
  const efcc = filterAgencies(AGENCIES, 'efcc');
  assert.equal(efcc.length, 1);
  assert.equal(efcc[0].acronym, 'EFCC');
});

test('filterForumPosts filters by voteAction and hashtag', () => {
  const downrated = filterForumPosts(FORUM_POSTS, 'downrated', 'all');
  assert.ok(downrated.length > 0);
  assert.ok(downrated.every((p) => p.taggedEntity?.voteAction === 'downrated'));

  const passport = filterForumPosts(FORUM_POSTS, 'latest', '#PassportReform');
  assert.equal(passport.length, 1);
  assert.equal(passport[0].id, 'post-1');
});
