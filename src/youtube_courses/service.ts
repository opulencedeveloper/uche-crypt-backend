import { Request } from "express";

import YoutubeCourse from "./entity";

class YoutubeCoursesService {
  public async postYoutubeCourse(req: Request) {
    const { video_url } = req.body;

    const youtubeCourse = new YoutubeCourse({
      video_url,
    });

    await youtubeCourse.save();

    return youtubeCourse;
  }

  public async getYoutubeCourses() {
    const youtubeCourses = await YoutubeCourse.find();

    return youtubeCourses;
  }
}

export const youtubeCoursesService = new YoutubeCoursesService();
