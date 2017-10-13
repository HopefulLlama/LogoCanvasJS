describe('LogoCanvas', () => {
  const DEFAULT_WIDTH = 1920;
  const DEFAULT_HEIGHT = 1080;
  const ID = 'mockID';

  let mockContext, mockDomElement, testee; 

  beforeEach(() => {
    mockContext = jasmine.createSpyObj('context', ['clearRect', 'beginPath', 'moveTo', 'lineTo', 'stroke']);
    
    mockDomElement = jasmine.createSpyObj('domElement', ['getContext']);
    mockDomElement.width = 0;
    mockDomElement.height = 0;
    mockDomElement.clientWidth = DEFAULT_WIDTH;
    mockDomElement.clientHeight = DEFAULT_HEIGHT;
    mockDomElement.getContext.and.returnValue(mockContext);

    spyOn(window, 'addEventListener').and.callThrough();
    spyOn(document, 'getElementById').and.returnValue(mockDomElement);

    testee = new LogoCanvas(ID);
  });

  describe('construction', () => {
    it('should get the canvas and create 2D context from passed ID', () => {
      expect(document.getElementById).toHaveBeenCalledWith('mockID');
      expect(mockDomElement.getContext).toHaveBeenCalledWith('2d');
    });

    it('should set to client height and width', () => {
      expect(testee.domElement).toBe(mockDomElement);
      expect(testee.context).toBe(mockContext);
    });

    it('should attach a function to the resize event', () => {
      expect(window.addEventListener).toHaveBeenCalledWith('resize', jasmine.any(Function));
    });
  });

  describe('clear', () => {
    it('should clear the entire canvas space', () => {
      testee.clear();

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
    });
  });

  describe('resize', () => {
    it('should set the width and height to the client width and height', () => {
      mockDomElement.width = 2;
      mockDomElement.height = 2;

      testee.resize();

      expect(mockDomElement.width).toBe(DEFAULT_WIDTH);
      expect(mockDomElement.height).toBe(DEFAULT_HEIGHT);
    });
  });

  describe('draw', () => {
    it('should draw a line', () => {
      testee.drawLine({
        start: {position: {x: 0, y: 0}, penDown: true, colour: '#000000'},
        end: {position: {x: 10, y: 10}, penDown: true, colour: '#000000'}
      });

      expect(mockContext.beginPath.calls.count()).toBe(1);
      expect(mockContext.moveTo.calls.count()).toBe(1);
      expect(mockContext.lineTo.calls.count()).toBe(1);
      expect(mockContext.stroke.calls.count()).toBe(1);

      expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
      expect(mockContext.lineTo).toHaveBeenCalledWith(10, 10);
    });

    it('should set the context strokeStyle to the start colour', () => {
      testee.drawLine({
        start: {position: {x: 0, y: 0}, penDown: true, colour: '#000000'},
        end: {position: {x: 0, y: 0}, penDown: true, colour: '#000000'}
      });

      expect(mockContext.strokeStyle).toBe('#000000');

      testee.drawLine({
        start: {position: {x: 0, y: 0}, penDown: true, colour: '#FF0000'},
        end: {position: {x: 0, y: 0}, penDown: true, colour: '#FF0000'}
      });

      expect(mockContext.strokeStyle).toBe('#FF0000');
    });

    it('should reduce the journey, then draw a line for each part of a journey', () => {
      let mockJourney = [1, 2, 3];

      testee.reduceJourney = jasmine.createSpy('reduceJourney').and.returnValue(mockJourney);
      testee.drawLine = jasmine.createSpy('drawLine');

      testee.drawJourney(mockJourney);

      expect(testee.reduceJourney).toHaveBeenCalledWith(mockJourney);
      expect(testee.reduceJourney.calls.count()).toBe(1);

      expect(testee.drawLine.calls.count()).toBe(3);
    });
  });

  describe('reduceJourney', () => {
    it('should not include waypoint pairs where the pen is up', () => {
      let journey = [
        {id: 0, penDown: false},
        {id: 1, penDown: false},
        {id: 2, penDown: true},
        {id: 3, penDown: true},
        {id: 4, penDown: true},
        {id: 5, penDown: false},
        {id: 6, penDown: true}
      ];

      let result = testee.reduceJourney(journey);

      expect(result.length).toBe(2);
      result.forEach((waypoint) => {
        expect(waypoint.start.penDown).toBe(true);
        expect(waypoint.end.penDown).toBe(true);
      });

      expect(result[0].start.id).toBe(2);
      expect(result[0].end.id).toBe(3);

      expect(result[1].start.id).toBe(3);
      expect(result[1].end.id).toBe(4);
    });

    it('should only include waypoint pairs where the colours match', () => {
      let journey = [
        {id: 0, penDown: true, colour: '1'},
        {id: 1, penDown: true, colour: '2'},
        {id: 2, penDown: true, colour: 'c'},
        {id: 3, penDown: true, colour: 'c'},
        {id: 4, penDown: true, colour: 'c'},
        {id: 5, penDown: true, colour: '3'},
        {id: 6, penDown: true, colour: 'c'}
      ];

      let result = testee.reduceJourney(journey);

      expect(result.length).toBe(2);
      result.forEach((waypoint) => {
        expect(waypoint.start.colour).toBe('c');
        expect(waypoint.end.colour).toBe('c');
      });

      expect(result[0].start.id).toBe(2);
      expect(result[0].end.id).toBe(3);

      expect(result[1].start.id).toBe(3);
      expect(result[1].end.id).toBe(4);
    });
  });
});