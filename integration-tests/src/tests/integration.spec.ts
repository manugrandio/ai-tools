import axios from "axios";

const TIMEOUT = 1000 * 20;
const SAMPLE_TEXTS = [
  "uh huh. Hey, mike, you should connect. Yeah, back at you. Yeah, I'm a big fan. I actually just want to try this out because I'm a huge fan and uh, I wanted to say hi, but a few months, yeah, exactly. Uh, two months in joining a venture capital firm, Peterson Ventures here in Salt Lake. And, and you're, you're thinking of the elections people, What's that? Yeah. Great group of people. Yeah, definitely. Anyway, you're thinking on inflections just that's, I'm thinking about it all the time when we talk to entrepreneur.",
  "So anyway, I'm a big fan. Um, I actually want to talk to you a little bit about, we're always thinking about our, we're kind of paranoid are we seeing the best deals and best companies, especially in our backyard here in Utah. Um, and what I've heard about floodgate as you guys are really, really good first. You're very scrappy. And um, you know, get, get the most out of a little resources and you're very good at community. And I think that's something that we could be doing a lot better, especially kind of our own neck. ",
  "It was here in Salt Lake City Phil we're thinking about that. How can we do better by community? I've been really impressed with something like anchor list that you guys do, but we just have to get, you know, thinking back to your early days and how you started creating community around Floodgate. Um, anything, any kind of general lessons or advice that you, you can share. Yeah, well, you know, to be honest, I think we could be better at this. Here's how I look at us. You know, your mileage may vary right? But like in the late two thousands floodgate had an insight and that was that there was a gap between angels and VCS.",
  "You know, you couldn't raise a million dollars in Silicon Valley in 2000 and six. You had to raise a quarter of a million bucks from friends and family or you had to go straight to five million bucks. Series A so we said, okay, you can't raise a million dollars at a time when a lot of people are gonna want to raise that much because you got this thing called lean startups. And so, you know, there was steve blank and Erik Reece, there were good friends. So we just totally captured the zeitgeist of the time, right?",
  "Like, like the 500,000 is the new five million Was the perfect point of view to have in 2006. And luckily we were right, but actually unfortunately we're really right. So before we knew it, There there was no longer a gap. Not only was there not a gap, there were like 1000 seed funds. Now there's 2000 seed funds and so our initial insight was no longer true. So what do you do? You have two options, you can just build your reputation and just try to out execute people, just say we're ogc need fund people, take our money, we're better and smarter or cooler.",
  "Um that didn't feel right to me, especially since in venture you get older than you get out of touch and entrepreneurs don't really care that you were no Gvc right. The other option is to find a new insight and I believe that our insight is that we try to get to know the best founders before they start a startup. We're trying to find Patrick collison before he starts stripe. Um, and so like when I invested in applied intuition castro units and I've been spending time for nine months talking about different ideas and different things can do.",
  "So if in recent Horowitz is like a talent agency like Michael Ovitz and CIA, we're trying to be talent scouts like billy Beane and we're trying to apply sabermetrics to understanding who is likely going to be great someday, sometimes we'll be wrong, sometimes they won't start a startup, sometimes they'll start a startup and it will be so compelling, they'll take money from somebody else, not us, but but our instinct is that as long as we keep our size small, that's okay because you don't have to be in every great deal, you just have to spend your time with the very best people.",
  "And it's kind of a leap of faith that the dots will forward connect. And so that's, that's our story. We're so I like to say we've gone from 500,000 is the new five million is saying we're your first true believers, but we're your first true believers, not your startups first true believers. Because we don't know if you've got to start up yet or ever will, but we just believe there is a set of people on the move in the world who are future prime movers and we exist to help them regardless of where they end up",
];

describe("Integration", () => {
  it("requests multiple summaries and checks their status", async () => {
    const postPromises = SAMPLE_TEXTS.map(async text => {
      const url = 'http://localhost:3000/api/transcription';
      const payload = { content: text };
      const response = await axios.post(url, payload);
      return response.data.uuid;
    });
    const uuids = await Promise.all(postPromises);

    console.log('UUIDS', uuids);

    // Wait 10 seconds
    await new Promise(r => setTimeout(r, 10 * 1000));

    const getPromises = uuids.map(async uuid => {
      const url = `http://localhost:3000/api/transcription/${uuid}`;
      const response = await axios.get(url);
      return response.data;
    });
    const transcriptions = await Promise.all(getPromises);
    console.log('TRANSCRIPTIONS', transcriptions);
    transcriptions.map(transcription => {
      expect(transcription.summary).toBeDefined();
      expect(transcription.status).toEqual("completed");
    });
  }, TIMEOUT);
});
