import { Request } from "express";

import AllCourse from "./entity";
import { slugify } from "../utils";

class AllCoursesService {
  public async uploadCourse(req: Request) {
    const {
      video_url,
      title,
      description,
      price,
      details,
      slashed_price,
      introduction,
      course_content,
    } = req.body;

    const slugified = slugify(title);

    const course = new AllCourse({
      video_url,
      title,
      description,
      price,
      slashed_price,
      slug: slugified,
      details,
      introduction,
      course_content,
    });

    await course.save();

    return course;
  }

  public async fetchAllAdsCourse() {
    const ad_courses = await AllCourse.find().select(
      "video_url title description price slug"
    );

    return ad_courses;
  }

  public async findCourseBySlug(req: Request) {
    const { title } = req.body;

    const slugified = slugify(title);

    const course = await AllCourse.findOne({ slug: slugified });

    return course;
  }

  //fetches courses by slug excluding course_content video urls and slug
  public async fetchAllAdsCourseDetail(req: Request) {
    const { slug } = req.params;

    const [ads_courses_detail] = await AllCourse.aggregate([
      {
        $match: { slug: slug },
      },
      {
        $project: {
          video_url: 1,
          title: 1,
          description: 1,
          price: 1,
          details: 1,
          introduction: 1,
          course_content: {
            module_number: 1,
            title: 1,
            description: 1,
          },
        },
      },
    ]).exec();
    //exec() ensures that an object is returned instead of an array with 1 item
    return ads_courses_detail;
  }

  public async find_course_by_id(course_id: string) {
    const course = await AllCourse.findById(course_id);

    return course;
  }
}

export const allCoursesService = new AllCoursesService();
