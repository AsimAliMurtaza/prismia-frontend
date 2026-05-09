import { NextResponse } from "next/server"

import dbConnect from "@/lib/mongodb"

import Resume from "@/models/Resume"
import Candidate from "@/models/Candidate"
import Screening from "@/models/Screening"
import Job from "@/models/Job"
import Interview from "@/models/Interview"

export async function GET() {
  try {
    await dbConnect()

    /* =========================================
       BASIC STATS
    ========================================= */

    const [
      totalResumes,
      totalCandidates,
      totalScreenings,
      activeJobs,

      totalInterviews,
      completedInterviews,
      scheduledInterviews,

      acceptedCandidates,
      rejectedCandidates,
    ] = await Promise.all([
      Resume.countDocuments(),

      Candidate.countDocuments(),

      Screening.countDocuments(),

      Job.countDocuments({
        is_active: true,
      }),

      Interview.countDocuments(),

      Interview.countDocuments({
        status: "completed",
      }),

      Interview.countDocuments({
        status: "scheduled",
      }),

      Screening.countDocuments({
        status: "accepted",
      }),

      Screening.countDocuments({
        status: "rejected",
      }),
    ])

    /* =========================================
       RECENT ACTIVITY
    ========================================= */

    const recentActivity = await Screening.aggregate([
      {
        $sort: {
          created_at: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "candidates",
          localField: "candidate_id",
          foreignField: "_id",
          as: "candidate",
        },
      },

      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "job",
        },
      },

      {
        $project: {
          _id: 1,

          status: 1,

          final_score: 1,

          created_at: 1,

          candidateName: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$candidate.full_name",
                  0,
                ],
              },
              "Unknown Candidate",
            ],
          },

          role: {
            $ifNull: [
              {
                $arrayElemAt: [
                  "$job.title",
                  0,
                ],
              },
              "Unknown Role",
            ],
          },
        },
      },
    ])

    /* =========================================
       OPEN POSITIONS
    ========================================= */

    const openPositions = await Job.aggregate([
      {
        $match: {
          is_active: true,
        },
      },

      {
        $lookup: {
          from: "screenings",
          localField: "_id",
          foreignField: "job_id",
          as: "applications",
        },
      },

      {
        $project: {
          _id: 1,

          title: 1,

          applicants: {
            $size: "$applications",
          },

          shortlisted: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",

                cond: {
                  $gte: [
                    "$$app.final_score",
                    70,
                  ],
                },
              },
            },
          },
        },
      },

      {
        $sort: {
          applicants: -1,
        },
      },
    ])

    /* =========================================
       WEEKLY SCREENINGS
    ========================================= */

    const rawWeeklyData =
      await Screening.aggregate([
        {
          $group: {
            _id: {
              $dayOfWeek: "$created_at",
            },

            screenings: {
              $sum: 1,
            },
          },
        },
      ])

    const daysMap = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]

    const formattedWeeklyData = Array.from(
      { length: 7 },
      (_, index) => {
        const found = rawWeeklyData.find(
          (d) => d._id === index + 1
        )

        return {
          day: daysMap[index],
          screenings:
            found?.screenings || 0,
        }
      }
    )

    /* =========================================
       MONTHLY HIRING TREND
    ========================================= */

    const rawHiringTrend =
      await Screening.aggregate([
        {
          $match: {
            status: "accepted",
          },
        },

        {
          $group: {
            _id: {
              $month: "$created_at",
            },

            hires: {
              $sum: 1,
            },
          },
        },
      ])

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]

    const formattedHiringTrend = Array.from(
      { length: 12 },
      (_, index) => {
        const found = rawHiringTrend.find(
          (m) => m._id === index + 1
        )

        return {
          month: months[index],
          hires: found?.hires || 0,
        }
      }
    )

    /* =========================================
       TOP SKILLS
    ========================================= */

    const topSkills = await Resume.aggregate([
      {
        $unwind: "$parsed_data.skills",
      },

      {
        $group: {
          _id: {
            $toLower:
              "$parsed_data.skills",
          },

          count: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          count: -1,
        },
      },

      {
        $limit: 10,
      },
    ])

    /* =========================================
       INTERVIEW STATUS ANALYTICS
    ========================================= */

    const interviewStats =
      await Interview.aggregate([
        {
          $group: {
            _id: "$status",

            count: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ])

    /* =========================================
       RESPONSE
    ========================================= */

    return NextResponse.json({
      success: true,

      stats: {
        totalResumes,
        totalCandidates,
        totalScreenings,
        activeJobs,

        totalInterviews,
        completedInterviews,
        scheduledInterviews,

        acceptedCandidates,
        rejectedCandidates,
      },

      recentActivity,

      openPositions,

      weeklyData:
        formattedWeeklyData,

      hiringTrend:
        formattedHiringTrend,

      topSkills,

      interviewStats,
    })
  } catch (error) {
    console.error(
      "Dashboard API Error:",
      error
    )

    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch dashboard analytics",
      },

      {
        status: 500,
      }
    )
  }
}