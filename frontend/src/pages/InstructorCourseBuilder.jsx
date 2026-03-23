import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI, sectionsAPI, lessonsAPI } from '../api/index';
import { PageLoader } from '../components/common/Loader';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';

const InstructorCourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(courseId ? true : false);
  const [course, setCourse] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    language: 'English',
    price: 0,
    discountPrice: 0,
    requirements: [],
    outcomes: [],
    sections: []
  });

  useEffect(() => {
    if (courseId) {
      const load = async () => {
        try {
          const res = await coursesAPI.getBySlug(courseId);
          setCourse({
            ...res.data.data,
            requirements: res.data.data.requirements || [],
            outcomes: res.data.data.outcomes || [],
            sections: res.data.data.sections || []
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      load();
    }
  }, [courseId]);

  const generateSlug = (title) => {
    return title.toLowerCase().trim().replace(/\s+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setCourse({ ...course, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (courseId) {
        await coursesAPI.update(courseId, course);
      } else {
        await coursesAPI.create(course);
      }
      navigate('/instructor');
    } catch (err) {
      console.error(err);
    }
  };

  const addSection = () => {
    setCourse({
      ...course,
      sections: [...(course.sections || []), { title: 'New Section', lessons: [] }]
    });
  };

  const addLessonToSection = (sectionIndex) => {
    const sections = [...(course.sections || [])];
    if (!sections[sectionIndex].lessons) sections[sectionIndex].lessons = [];
    sections[sectionIndex].lessons.push({ title: 'New Lesson', youtubeUrl: '', duration: 0 });
    setCourse({ ...course, sections });
  };

  const removeSection = (sectionIndex) => {
    const sections = (course.sections || []).filter((_, i) => i !== sectionIndex);
    setCourse({ ...course, sections });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const sections = [...(course.sections || [])];
    sections[sectionIndex].lessons = sections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
    setCourse({ ...course, sections });
  };

  const updateSection = (sectionIndex, field, value) => {
    const sections = [...(course.sections || [])];
    sections[sectionIndex][field] = value;
    setCourse({ ...course, sections });
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    const sections = [...(course.sections || [])];
    sections[sectionIndex].lessons[lessonIndex][field] = value;
    setCourse({ ...course, sections });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-heading text-3xl font-bold">
              {courseId ? 'Edit Course' : 'Create New Course'}
            </h1>
            <span className="text-muted">Step {step} of 5</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-heading font-bold text-2xl">Basic Information</h2>

              <div>
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  value={course.title}
                  onChange={handleTitleChange}
                  placeholder="e.g., Advanced React Patterns"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={course.slug}
                  onChange={(e) => setCourse({ ...course, slug: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={course.description}
                  onChange={(e) => setCourse({ ...course, description: e.target.value })}
                  placeholder="Describe what students will learn..."
                  rows="5"
                  className="input-field"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={course.category}
                    onChange={(e) => setCourse({ ...course, category: e.target.value })}
                    className="input-field"
                  >
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                    <option>Cloud Computing</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Level</label>
                  <select
                    value={course.level}
                    onChange={(e) => setCourse({ ...course, level: e.target.value })}
                    className="input-field"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Language</label>
                  <select
                    value={course.language}
                    onChange={(e) => setCourse({ ...course, language: e.target.value })}
                    className="input-field"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={course.price}
                    onChange={(e) => setCourse({ ...course, price: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Thumbnail */}
          {step === 2 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-heading font-bold text-2xl">Course Thumbnail</h2>

              <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center">
                <p className="text-muted mb-4">Upload a course thumbnail image</p>
                <input type="file" accept="image/*" className="w-full" />
                <p className="text-sm text-muted mt-2">JPG, PNG up to 5MB</p>
              </div>
            </div>
          )}

          {/* Step 3: Course Content */}
          {step === 3 && (
            <div className="card p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-heading font-bold text-2xl">Course Content</h2>
                <button
                  type="button"
                  onClick={addSection}
                  className="btn-secondary text-sm"
                >
                  <Plus size={16} /> Add Section
                </button>
              </div>

              <div className="space-y-6">
                {(course.sections || []).map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                        placeholder="Section title"
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeSection(sectionIndex)}
                        className="text-accent hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="ml-4 space-y-3">
                      {(section.lessons || []).map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex gap-3">
                          <input
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                            placeholder="Lesson title"
                            className="input-field flex-1"
                          />
                          <input
                            type="text"
                            value={lesson.youtubeUrl}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'youtubeUrl', e.target.value)}
                            placeholder="YouTube ID or URL"
                            className="input-field flex-1"
                          />
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', e.target.value)}
                            placeholder="Duration (sec)"
                            className="input-field w-24"
                          />
                          <button
                            type="button"
                            onClick={() => removeLesson(sectionIndex, lessonIndex)}
                            className="text-accent hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addLessonToSection(sectionIndex)}
                        className="btn-secondary text-sm w-full"
                      >
                        <Plus size={16} /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Learning Goals */}
          {step === 4 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-heading font-bold text-2xl">Learning Goals</h2>

              <div>
                <label className="form-label">Requirements</label>
                <textarea
                  value={(course.requirements || []).join('\n')}
                  onChange={(e) => setCourse({ ...course, requirements: e.target.value.split('\n').filter(r => r) })}
                  placeholder="One requirement per line"
                  rows="4"
                  className="input-field"
                ></textarea>
              </div>

              <div>
                <label className="form-label">What will students learn?</label>
                <textarea
                  value={(course.outcomes || []).join('\n')}
                  onChange={(e) => setCourse({ ...course, outcomes: e.target.value.split('\n').filter(o => o) })}
                  placeholder="One outcome per line"
                  rows="4"
                  className="input-field"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 5: Review & Publish */}
          {step === 5 && (
            <div className="card p-8 space-y-6">
              <h2 className="font-heading font-bold text-2xl">Review & Publish</h2>

              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <p className="text-muted text-sm">Title</p>
                  <p className="font-bold">{course.title}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Category</p>
                  <p className="font-bold">{course.category} - {course.level}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Price</p>
                  <p className="font-bold">₹{course.price}</p>
                </div>
                <div>
                  <p className="text-muted text-sm">Sections</p>
                  <p className="font-bold">{(course.sections || []).length} sections, {(course.sections || []).reduce((sum, s) => sum + (s.lessons?.length || 0), 0)} lessons</p>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full text-lg font-bold py-3"
              >
                {courseId ? 'Update Course' : 'Publish Course'}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="btn-secondary disabled:opacity-50"
            >
              <ChevronLeft size={20} /> Previous
            </button>

            {step < 5 && (
              <button
                type="button"
                onClick={() => setStep(Math.min(5, step + 1))}
                className="btn-primary"
              >
                Next <ChevronRight size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstructorCourseBuilder;
